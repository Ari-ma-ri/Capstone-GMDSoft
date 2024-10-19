Overview

This is a web application built using Flask. Once the program is launched, you can access it through the local server at `http://127.0.0.1:5000`.

Prerequisites

Make sure you have the following installed before running the application:

- Python (version 3.x)
- Flask

To install Flask, run:

```
pip install Flask
```

How to Run the Program

1. Clone or download the repository containing `app.py`.

2. Navigate to the project directory where the `app.py` file is located.

3. Install Flask (if not already installed) by running the following command:

   ```
   pip install Flask
   ```

4. Run the application using the following command in your terminal:

   ```
   python app.py
   ```

5. Once the application is running, open your browser and go to:

   ```
   http://127.0.0.1:5000
   ```

   You should now be able to interact with the web application.

Additional Notes

- Make sure port 5000 is available on your machine.
- If you want to change the port, modify the `app.run()` line in the `app.py` file as shown below:

   ```
   app.run(port=<desired_port>)
   ```
