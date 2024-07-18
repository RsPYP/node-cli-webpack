import csv
import random

names = ["John Doe", "Jane Smith", "Jim Brown", "Jill White", "Jack Black"]
companies = ["Company A", "Company B", "Company C", "Company D", "Company E", "Company F", "Company G", "Company H", "Company I", "Company J"]

with open('inputData.csv', mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(['name', 'age', 'gender', 'company'])
    for i in range(1000):
        name = random.choice(names)
        age = random.randint(20, 70)
        gender = random.choice(['Male', 'Female'])
        company = random.choice(companies)
        writer.writerow([name, age, gender, company])

print("CSV file generated successfully.")
