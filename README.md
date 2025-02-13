# EVHelper

This Progressive Web Application simplifies tracking electric vehicle charging costs based on variable Nord Pool electricity prices, making it especially useful for entrepreneurs charging their EVs with company funds.

## Features 
- Automatically fetches real-time Nord Pool electricity prices.
- Calculates charging costs based on time and energy consumption.
- Exports xlsx-file accepted by Finnish Tax Adminstrators.
- Adds transmission fees and margin costs.

## Technologies Used
- **Framework**: [Next.js](https://nextjs.org/) (App Router), built on [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) for type-safe development
- **Backend**: Next.js API Routes for server-side logic
- **UI Library**: [Mantine UI](https://mantine.dev/) for component styling and design
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (cloud-hosted NoSQL database)
- **Progressive Web Application ([PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps))**: Installable on Android and iOS devices, with full-screen support
- **3rd Party APIs**: [Porssisahko.net](https://porssisahko.net/api) for fetching electricity prices for specific time frames

## Views of the Application
![image](https://github.com/user-attachments/assets/bcbae5b5-0b7c-41f9-9544-92dd4b36cbb6)

## Example of Exported xlsx-file
![image](https://github.com/user-attachments/assets/15f6033c-5c00-449a-ab87-41b66e454644)
