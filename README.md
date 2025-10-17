⚡ SpeedWave: Real-time Internet Speed Tester

SpeedWave is a sleek, modern, single-page application for accurately measuring and visualizing your internet connection's performance. Built with React and designed with a dark, clean aesthetic, it provides real-time feedback on your download speed, upload speed, and latency (ping).

🚀 Features

Real-time Speed Measurement: Accurately calculates and displays current Download and Upload speeds in Mbps.

Latency Check: Measures the network Ping in milliseconds (ms).

Visual Gauge: A central gauge component provides immediate, high-impact feedback on the current measured speed.

Speed Graph: Features a dynamic line chart to visualize speed fluctuations over the duration of the test.

Test History: A dedicated sidebar maintains a list of previous test results, including date, time, and key metrics.

Responsive Design: Optimized for modern desktop and mobile browsers.

<img width="2560" height="1600" alt="image" src="https://github.com/user-attachments/assets/3e702c30-b10f-4400-b40a-557dd4cf596e" />


🛠️ Tech Stack

Frontend Framework: React (with functional components and Hooks)

Styling: Bootstrap CSS 

Charting: Assumed a charting library (e.g., Recharts, Chart.js) for the speed graph.

API/Logic: Pure JavaScript for handling the speed test calculation logic.

⚙️ Getting Started

Follow these steps to set up and run the project locally.

Prerequisites

You must have Node.js and npm (or yarn) installed on your system.

Installation

Clone the repository:

git clone [https://github.com/yourusername/speedwave-speed-tester.git](https://github.com/avirizzz/internetspeed.git)
cd speedwave-speed-tester


Install Dependencies:

npm install
# OR
yarn install


Run the application:

npm start
# OR
yarn start


The application should open automatically in your browser at http://localhost:3000.

💡 How to Use

Navigate to the Speed Test tab (which is the default view).

Click the Start Test button at the bottom of the main card.

The gauge and graph will update in real-time as the download, upload, and ping tests run.

Once complete, the final metrics will be displayed in the center, and the result will be logged in the Test History sidebar.
