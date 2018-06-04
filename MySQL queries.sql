-- use sakila database 
USE sakila;

-- Display the first and last names of all actors from the table `actor`. 
SELECT first_name, last_name
FROM actor;
-- Display the first and last name of each actor in a single column in upper case letters. 
-- Name the column `Actor Name`. 
SELECT CONCAT(first_name, " ", last_name) AS 'Actor Name'
FROM actor; 
-- Find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?
SELECT actor_id, first_name, last_name
FROM actor
WHERE first_name = 'Joe';

-- Find all actors whose last name contain the letters `GEN`:
SELECT first_name, last_name
FROM actor
WHERE last_name LIKE '%GEN%';

-- Find all actors whose last names contain the letters `LI`. 
-- Order the rows by last name and first name.

SELECT last_name, first_name
FROM actor
WHERE last_name LIKE '%LI%';

-- Using `IN`, display the `country_id` and `country` columns of the following countries: Afghanistan, Bangladesh, and China
SELECT country_id, country
FROM country
WHERE country IN('Afghanistan','Bangladesh','China');

-- Add a `middle_name` column to the table `actor`. Position it between `first_name` and `last_name`.
ALTER TABLE actor
ADD middle_name VARCHAR(20) AFTER first_name;

-- check the result of the table:
SELECT first_name, middle_name, last_name FROM actor;

-- Change the data type of the `middle_name` column to `blobs`
ALTER TABLE actor MODIFY middle_name BLOB;

-- delete the `middle_name` column
ALTER TABLE actor
DROP COLUMN middle_name;

-- List the last names of actors, as well as how many actors have that last name.
SELECT last_name, COUNT(last_name) AS 'Count Last Name'
FROM actor
GROUP BY last_name;

-- List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
SELECT last_name, COUNT(last_name) AS 'Count_Last_Name'
FROM actor
GROUP BY last_name
HAVING Count_Last_Name>=2;

-- The actor `HARPO WILLIAMS` was accidentally entered in the `actor` table as `GROUCHO WILLIAMS`. Write a query to fix the record.

-- Find actor_id related to 'Harpo Williams'
SELECT * from actor
WHERE first_name='GROUCHO' AND last_name='WILLIAMS';

-- Update first name from Groucho to Harpo. I found from previous query that his actor_id is 172
UPDATE `sakila`.`actor` SET `first_name`='HARPO' WHERE `actor_id`='172';

-- Check out the result
SELECT * from actor WHERE actor_id=172;

-- In a single query, if the first name of the actor is currently `HARPO`, change it to `GROUCHO`. 
-- Otherwise, change the first name to `MUCHO GROUCHO`

-- sneak peak to see if there are multiple actors named "Harpo". 
-- (Obs.: Only 1 'Harpo' record was found.)
select * from actor where first_name = 'HARPO';
UPDATE `sakila`.`actor` SET `first_name`='GROUCHO' WHERE `actor_id`='172';

-- Check the result 
SELECT * from actor WHERE actor_id=172;

-- You cannot locate the schema of the `address` table. Which query would you use to re-create it? 
SHOW CREATE TABLE address;

-- Use `JOIN` to display the first and last names, as well as the address, of each staff member. 

-- check the staff and address tables before deciding where to join ON
DESCRIBE staff;
DESCRIBE address;

SELECT s.first_name, s.last_name, a.address
FROM staff s
JOIN address a
ON (s.address_id=a.address_id);

-- Use `JOIN` to display the total amount rung up by each staff member in August of 2005. 
-- Use tables `staff` and `payment`
describe payment;

SELECT p.payment_date, s.first_name, s.last_name, SUM(p.amount)
FROM staff s
JOIN payment p
ON (s.staff_id=p.staff_id)
AND p.payment_date LIKE '2005-08%'
GROUP BY s.last_name;
-- check the payment sum from august to check the final values and compare with the query findings.
SELECT SUM(amount) FROM payment
WHERE payment_date LIKE '2005-08%';

-- List each film and the number of actors who are listed for that film. 
-- Use tables `film_actor` and `film`. Use inner join.
  	
describe film_actor;
describe film;

SELECT f.title, COUNT(DISTINCT(fa.actor_id)) AS 'Number of actors'
FROM film f
JOIN film_actor fa
ON (f.film_id = fa.film_id)
GROUP BY title;

-- How many copies of the film `Hunchback Impossible` exist in the inventory system?
SELECT COUNT(film_id) AS 'Count of Hunchback Impossible' FROM inventory
WHERE film_id IN
(
SELECT film_id
FROM film
WHERE title='Hunchback Impossible'
);
-- Using the tables `payment` and `customer` and the `JOIN` command, list the total paid by each customer. 
-- List the customers alphabetically by last name:
SELECT c.customer_id, c.first_name, c.last_name, SUM(p.amount)
FROM customer c
JOIN payment p
ON (c.customer_id = p.customer_id)
GROUP BY customer_id
ORDER BY last_name ASC;

-- Use subqueries to display the titles of movies starting with the letters `K` and `Q` whose language is English. 
SELECT * FROM language;

SELECT title FROM film
WHERE title LIKE 'Q%' OR title LIKE 'K%' AND language_id IN
(
SELECT language_id FROM language
WHERE language_id = 1
);

-- Use subqueries to display all actors who appear in the film `Alone Trip`.

-- FROM actor get actor_id; FROM film get title, film_id; FROM film_actor get film_id, actor_id
SELECT * FROM actor;
SELECT * FROM film;

SELECT first_name, last_name FROM actor
WHERE actor_id IN
(
SELECT actor_id FROM film_actor
WHERE film_id IN
(
SELECT film_id FROM film
WHERE title = "Alone Trip"
));

-- Get the names and email addresses of all Canadian customers.
-- Use joins to retrieve this information.
SELECT * FROM customer;
SELECT * FROM address;
SELECT * FROM city;
SELECT * FROM country;

SELECT first_name, last_name, email, customer_id, country.country
FROM customer c
    JOIN address a
        ON a.address_id = c.address_id
    JOIN city ci
        ON ci.city_id = a.city_id
	JOIN country 
		ON country.country_id = ci.country_id
			WHERE country = 'Canada';

-- Another query for the same question, but using IN instead of JOIN         
-- FROM customer get first_name, last_name, email, customer_id
-- FROM country country_id = 20 or country = Canada
-- FROM address city_id
-- FROM city city_id, country_id
SELECT first_name, last_name, email FROM customer
WHERE address_id IN
(
SELECT address_id FROM address
WHERE city_id IN
(
SELECT city_id FROM city
WHERE country_id IN
(
SELECT country_id FROM country
WHERE country = 'Canada'
)));

-- Identify all movies categorized as family films.
SELECT * FROM category;
-- found category_id 8 , name Family
SELECT * FROM film;
-- found film_id and title
SELECT * FROM film_category;
-- found film_id and category_id

SELECT f.title, c.category_id
FROM film f 
LEFT JOIN film_category 
	ON f.film_id = film_category.film_id
LEFT JOIN category c 
	ON c.category_id = film_category.category_id
WHERE c.category_id = 8;

-- Display the most frequently rented movies in descending order.
-- Find the most rented movies:
SELECT MAX(rental_duration) FROM film;
-- 7 is the max rental duration
SELECT title FROM film WHERE rental_duration = 7
ORDER BY title DESC
LIMIT 10;

-- Write a query to display how much business, in dollars, each store brought in.
SELECT * FROM store;
-- there are two stores. Store_id 1 and 2. manager_staff_id
SELECT * FROM staff;
-- there are two people on staff with staff_id 1 and 2. store_id
SELECT * FROM payment;
-- staff_id and amount

SELECT st.store_id, SUM(p.amount) AS 'Total $ Amount'
FROM payment p
LEFT JOIN staff s
ON s.staff_id = p.staff_id
LEFT JOIN store st
ON s.store_id = st.store_id
GROUP BY s.store_id;

-- Write a query to display for each store its store ID, city, and country.
-- tables to join: store, address, city, country
SELECT s.store_id, c.city, co.country
FROM store s 
JOIN address a
ON a.address_id = s.address_id
JOIN city c
ON c.city_id = a.city_id
JOIN country co
ON co.country_id = c.country_id;

-- List the top five genres in gross revenue in descending order. 
-- tables: category, film_category, inventory, payment, and rental.
SELECT ca.name, SUM(p.amount) AS 'Gross Revenue'
	FROM category ca
	JOIN film_category fca
		ON ca.category_id = fca.category_id
	JOIN inventory i
		ON i.film_id = fca.film_id
	JOIN rental r
		ON r.inventory_id = i.inventory_id
	JOIN payment p
		ON p.rental_id = r.rental_id
GROUP BY name
ORDER BY amount DESC
LIMIT 5;

-- Create a 'view' to show top five genres by gross revenue.
CREATE VIEW top_genres_revenue AS
SELECT ca.name, SUM(p.amount) AS 'Gross Revenue'
	FROM category ca
	JOIN film_category fca
		ON ca.category_id = fca.category_id
	JOIN inventory i
		ON i.film_id = fca.film_id
	JOIN rental r
		ON r.inventory_id = i.inventory_id
	JOIN payment p
		ON p.rental_id = r.rental_id
GROUP BY name
ORDER BY amount DESC
LIMIT 5;

-- Display the just created top_revenue view
SELECT * FROM top_genres_revenue;

-- You find that you no longer need the view `top_five_genres`. Write a query to delete it.
DROP VIEW top_genres_revenue;