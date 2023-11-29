import "./About.css";

const About = () => {
  return (
    <div>
      <main id="body">
        <div class="info">
          <label>
            <b>Course Name:</b>
          </label>
          <span>
            Com S 319 - Construction of User Interfaces
            <br />
            Spring 2023
          </span>
        </div>

        <div class="info">
        <b>Developer Names:</b>
          <span>
            Jacob Schulmeister V<br/>
            Tim Kuehn<br/><br/>
          </span>
          <img src="./images/DeveloperPhoto.JPG" width="300" height="225" />
        </div>

        <div class="info">
          <label>
            <b>Student Emails:</b>
          </label>
          <span>
            jdschul5@iastate.edu
            <br />
          </span>
          <span>timkuehn@iastate.edu</span>
        </div>

        <div class="info">
          <label>
            <b>Name of the Professor:</b>
          </label>
          <span>
            Dr. Aldaco
          </span>
        </div>

        <div class="info">
          <label>
            <b>Date:</b>
          </label>
          <span>11/28/2023 </span>
          <p>
            This project was completed using a Raspberry Pi 3B+ running html,
            CSS, Python, and JavaScript. This was connected via USB to an
            arduino running ADC code that took the analog data from a water
            depth sensor and converted it to digital Additionally, we took
            digital sensor data from a DHT 11 that gave humidity and temperature
            sensors. This project was designed to be mounted in the bilge of a
            boat so that the state of the boat is easily readable from at the
            helm. The code for the ADC is in "waterlevel.ino"
          </p>
        </div>
      </main>
    </div>
  );
};

export default About;
