CREATE DATABASE GroceryStoreDB;
USE GroceryStoreDB;

CREATE TABLE Stores (
    storeID INT AUTO_INCREMENT PRIMARY KEY,
    nameOfOwnerOfTheStore VARCHAR(100),
    email VARCHAR(100),
    phoneNumber VARCHAR(20),
    location VARCHAR(100)
);

CREATE TABLE Products (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    storeID INT,
    nameOfProduct VARCHAR(100),
    unitPrice DECIMAL(10,2),
    quantity INT,
    totalPrice DECIMAL(10,2),
    isAvailable BOOLEAN,
    FOREIGN KEY (storeID) REFERENCES Stores(storeID) ON DELETE CASCADE
);

INSERT INTO Stores (nameOfOwnerOfTheStore, email, phoneNumber, location)
VALUES ('Adigun Felix', 'ad9@example.com', '123-456-7890', 'kansas');

INSERT INTO Products (storeID, nameOfProduct, unitPrice, quantity, totalPrice, isAvailable)
VALUES (1, 'Apples', 1.50, 20, 30.00, TRUE);

SELECT * FROM Stores;
SELECT * FROM products;

SELECT P.*, S.nameOfOwnerOfTheStore
FROM Products P
JOIN Stores S ON P.storeID = S.storeID;

UPDATE Stores
SET phoneNumber = '987-654-3210'
WHERE storeID = 1;

UPDATE Products
SET isAvailable = FALSE
WHERE productID = 1;


DELETE FROM Products
WHERE productID = 1;


DELETE FROM Stores
WHERE storeID = 1;


DELIMITER //
CREATE TRIGGER calc_total_price_before_insert
BEFORE INSERT ON Products
FOR EACH ROW
BEGIN
   SET NEW.totalPrice = NEW.unitPrice * NEW.quantity;
END;
//
DELIMITER ;






