# import necessary libraries
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, inspect, func, desc
from sqlalchemy import func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import sqlalchemy
import numpy as np
import pandas as pd

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
#create a connection to the database

engine = create_engine("sqlite:///DataSets/belly_button_biodiversity.sqlite")
#conn = engine.connect()
#inspector = inspect(engine)

Base = automap_base()
Base.prepare(engine, reflect = True)

# Print all of the classes mapped to the Base
#Base.classes.keys()
#Base.metadata.create_all(engine)
#11.3 Ins_Joins create tables

Sample = Base.classes.samples
Otu = Base.classes.otu
Metadata = Base.classes.samples_metadata

# Create our session to connect to DB. This is a temporary binding to DB
session = Session(engine)

#################################################
# Flask Routes - define static routes
#################################################
# Returns the dashboard homepage

@app.route("/")
def index():
    return render_template("index.html")

#################################################
# Returns a list of sample names

@app.route('/names')

def names():

    # session . query and pass the class, storing it in "all names"
    all_names = session.query(Sample).statement
    names_df = pd.read_sql_query(all_names, session.bind)
    names_df.set_index('otu_id', inplace=True)
    # Return a list of the column names (sample names)
    return jsonify(list(names_df.columns))

#################################################
# Returns a list of OTU descriptions 

@app.route('/otu')
def otu():
    
    results = session.query(Otu.lowest_taxonomic_unit_found).all()
    # Use numpy ravel to extract list of tuples into a list of OTU descriptions
    otu_list = list(np.ravel(results))
    return jsonify(otu_list)

#################################################
# Returns a json dictionary of sample metadata 

@app.route('/metadata/<sample>')

def sample_metadata(sample):

    sel = [Metadata.SAMPLEID, 
           Metadata.ETHNICITY,
           Metadata.GENDER, 
           Metadata.AGE,
           Metadata.LOCATION, 
           Metadata.BBTYPE]

    results = session.query(*sel).filter(Metadata.sampleid == sample[3:]).all()

# Create a dictionary entry for each row of metadata information

    sample_metadata = {}
    for result in results:

        sample_metadata['SAMPLEID'] = result[0]
        sample_metadata['ETHNICITY'] = result[1]
        sample_metadata['GENDER'] = result[2]
        sample_metadata['AGE'] = result[3]
        sample_metadata['LOCATION'] = result[4]
        sample_metadata['BBTYPE'] = result[5]

    return jsonify(sample_metadata)

#################################################
# Returns an integer value for the weekly washing frequency `WFREQ`

@app.route('/wfreq/<sample>')
def sample_wfreq(sample):

    # sel = [Metadata.sampleid, Metadata.wfreq]
    results = session.query(Metadata.WFREQ).filter(Metadata.SAMPLEID == sample[3:]).all()
    wfreq = np.ravel(results)

    # Return only the first integer value for washing frequency
    return jsonify(int(wfreq[0]))

#################################################
# Return a list of dictionaries containing sorted lists  for `otu_ids`and `sample_values`

@app.route('/samples/<sample>')
def samples(sample):

    all_samples = session.query(Sample).statement
    all_samples_df = pd.read_sql_query(all_samples, session.bind)
    
    if sample not in all_samples_df.columns:
        return jsonify(f"error, sample:{sample} not found"), 400
    all_samples_df = all_samples_df[all_samples_df[sample]>1]
    all_samples_df.sort_values(by=sample, ascending = 0)

    data = [
        {
            "otu_id":all_samples_df[sample].index.values.tolist(),
            "sample_values":all_samples_df[sample].values.tolist()
        }
    ]
    return jsonify(data)
    
if __name__ == "__main__":
    app.run(debug=True)