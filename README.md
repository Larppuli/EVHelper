# EVHelper

This Progressive Web Application simplifies tracking electric vehicle charging costs based on variable Nord Pool electricity prices, making it especially useful for entrepreneurs charging their EVs with company funds.

### Features 
- Automatically fetches real-time Nord Pool electricity prices.
- Calculates charging costs based on time and energy consumption.
- Exports xlsx-file accepted by Finnish Tax Adminstrators.
- Adds transmission fees and margin costs.

### Views of the application
![image](https://github.com/user-attachments/assets/bcbae5b5-0b7c-41f9-9544-92dd4b36cbb6)

### Example of exported xlsx-file
![image](https://github.com/user-attachments/assets/15f6033c-5c00-449a-ab87-41b66e454644)

## Installation & Setup  

Follow these steps to install and run **EVHelper** locally.  

### Prerequisites  
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)  
- [Yarn](https://yarnpkg.com/) (Install via `npm install -g yarn` if not already installed)  
- [Git](https://git-scm.com/)  

### Steps  

```sh
# 1. Clone the repository  
git clone https://github.com/your-username/EVHelper.git  
cd EVHelper  

# 2. Install dependencies  
yarn install  

# 3. Set up environment variables  
echo "MONGODB_URI=your_database_key_here" > .env
echo "MONGODB_DB=your_database_name_here" >> .env 

# 4. Run the application  
yarn start  
# The application should now be accessible at http://localhost:3000/  
