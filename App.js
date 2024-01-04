import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  TextInput,
  Text,
  View,
  StyleSheet,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import euroCountriesData from './eurocountries';
import { useStopwatch } from 'react-timer-hook';

//StAuth10244: I Adam Calleja, 000862779 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
/**
 * Desc: European Geo Guesser
 * This application is designed for people that want to challenge their geography knowledge on Europe or who want to learn more about Europe.
 * The application uses the MapView package as the game map. The map is fixed over the European continent.
 * The second package used is the React-Timer-Hook which is used to keep track of how long it takes for the user to guess all the european countries.
 * 2nd React Package Used: React-Timer-Hook: https://www.npmjs.com/package/react-timer-hook
 *
 * There are many features that are implemented for my game!
 * 1) Input Textfield: Used to guess European countries
 * 2) Pause/Resume Game: Used to stop time, (locks input textbox as well! no cheating!)
 * 3) Start Game: Start game from the beginning with 0 countries scored, list removed, and all pins readded
 * 4) Show/Hide Missing Countries: Shows pins on where the undiscovered countries are (Good Hint!)
 * 5) Info on Guessed Countries: When a country is guessed, it is added to a list. The user can click on a country to learn more about the country (capital and fun fact)
 *
 * YouTube Link: https://youtu.be/hoMr2XWnQYM
 *
 * Author: Adam Calleja
 * Date: December 16th, 2023
 */

export default function App() {
  const [countryData, setCountryData] = useState([]);
  const [unguessedCountries, setUnguessedCountries] = useState([]);
  const [guessedCountries, setGuessedCountries] = useState([]);
  const [score, setScore] = useState(0);
  const [showPins, setShowPins] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [selectedCountryInfo, setSelectedCountryInfo] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);

  let scoreDisplayContent;

  /**
   * Logic used from: https://www.npmjs.com/package/@ernestbies/react-timer-hook
   * Initialize the stopwatch 
   */
  const { seconds, minutes, start, pause, reset } = useStopwatch({
    autoStart: false,
  });

  /**
   * Load countries into country data and unguessed country data on load.
   */
  useEffect(() => {
    const countriesList = euroCountriesData.map((country) => country.country);
    setCountryData(countriesList);
    setUnguessedCountries(euroCountriesData);
  }, []);

  /**
   * Start game on press.
   * Make sure time is set to 0.
   * Reload unguessed countries, empty guessed countries, set score to 0
   */
  const startGame = () => {
    reset(0, false);
    start();
    setIsGameActive(true);
    setUnguessedCountries(euroCountriesData);
    setGuessedCountries([]);
    setScore(0);
    setSelectedCountryInfo(null);
  };

  /**
   * Pause or resume the time
   * Function also makes sure input textbox is locked when paused.
   */
  const pauseResumeGame = () => {
    if (isGameActive) {
      pause();
    } else {
      start();
    }
    setIsGameActive(!isGameActive);
  };

  /**
   * Show or hide the pins for the unsolved countries.
   */
  const showHideUnsolved = () => {
    setShowPins(!showPins);
  };

  /**
   * When the user presses enter after typing in a country in the input textbox, validate if that country is apart of the unguessed countries.
   * Pause the game once the last country has been guessed.
   * Remove the guessed country from unguessed array, add it to guessed array
   * Increment the score by one for each successful guess.
   * 
   */
  const checkGuess = () => {
    const guessedCountryIndex = unguessedCountries.findIndex(
      (country) => country.country.toLowerCase() == currentGuess.toLowerCase()
    );

    if (unguessedCountries.length <= 1) {
      pause();
    }

    if (guessedCountryIndex != -1) {
      //Add to guessed countries
      const newGuessedCountries = guessedCountries.slice(); //Copy over current guessed countries array
      newGuessedCountries.push(unguessedCountries[guessedCountryIndex]);
      setGuessedCountries(newGuessedCountries);

      //Removed from unguessed countries
      const newUnguessedCountries = [];
      for (let i = 0; i < unguessedCountries.length; i++) {
        if (i != guessedCountryIndex) {
          newUnguessedCountries.push(unguessedCountries[i]);
        }
      }
      setUnguessedCountries(newUnguessedCountries);

      //Increase Score
      const newScore = score + 1;
      setScore(newScore);

      //Clear input field
      setCurrentGuess('');
    } else {
      console.log("WRONG");
    }
  };
  /**
   * When a country in the guess list is clicked upon, show the capital/fun fact about that country
   * Removes previous country selected from fact box, displays current country selected.
   */
  const showCountryInfo = (country) => {
    const info =
      country.country +
      ' | Capital: ' +
      country.capital +
      '\nFun Fact: ' +
      country.fact;

    if (selectedCountryInfo == info) {
      setSelectedCountryInfo(null); //Hide previous info
    } else {
      setSelectedCountryInfo(info); //Show current info
    }
  };

  /**
   * Display the score of the game, or if all 50 countries are guessed let the user know
   * Display time once user has guessed all 50 countries.
   */
  if (score == 50) {
    scoreDisplayContent = (
      <Text style={styles.scoreText}>
        Great Job! Time Taken:{minutes.toString().padStart(2, '0')}:
        {seconds.toString().padStart(2, '0')}
      </Text>
    );
  } else {
    scoreDisplayContent = (
      <Text style={styles.scoreText}>
        Score: {score}/{countryData.length}
      </Text>
    );
  }

  /**
   * Game View:
   * Contains Input Box to gather user guess.
   * Start Game, Pause/Resume Game, and Show/Hide Missing Countries Buttons
   * Game Score
   * Time Elapsed
   * Map of Europe (Fixed, cannot move location)
   * Information on Guessed Countries (List that can be clicked to gather more information on country selected)
   */
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>European Country Guessing Game</Text>
        <View>
          <TextInput
            style={styles.textInput}
            title="Guess a Country"
            value={currentGuess}
            onChangeText={setCurrentGuess}
            onSubmitEditing={checkGuess}
            editable={isGameActive}
          />
          <View style={styles.twoButtons}>
            <Button title="Start Game" onPress={startGame} />
            <Button title="Pause/Resume Game" onPress={pauseResumeGame} />
          </View>
          <View style={styles.oneButton}>
            <Button
              title="Show/Hide Missing Countries"
              onPress={showHideUnsolved}
            />
          </View>
        </View>
        <View>
          <View style={styles.scoreContainer}>{scoreDisplayContent}</View>
          <Text style={styles.timeText}>
            Time Elapsed: {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </Text>
        </View>
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: 50.0,
            longitude: 15,
            latitudeDelta: 50.0,
            longitudeDelta: 30.0,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}>
          {showPins &&
            unguessedCountries.map((country, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: country.coordinates.lat,
                  longitude: country.coordinates.lon,
                }}
              />
            ))}
        </MapView>
        <View>
          <Text style={styles.heading}>Info on Guessed Countries</Text>
          {selectedCountryInfo && (
            <View style={styles.infoBox}>
              <Text>{selectedCountryInfo}</Text>
            </View>
          )}
          <View style={styles.guessedListContainer}>
            <ScrollView>
              {guessedCountries.map((country, index) => (
                <Text
                  key={index}
                  style={styles.countryListItem}
                  onPress={() => showCountryInfo(country)}>
                  {country.country}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
    paddingTop: 45,
    paddingBottom: 25,
  },
  mapStyle: {
    height: 400,
    width: '100%',
    borderRadius: 10,
    marginBottom: 15,
  },
  textInput: {
    borderColor: '#007BFF',
    borderWidth: 2,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  countryListItem: {
    backgroundColor: '#e7e7e7',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  guessedListContainer: {
    height: 150,
    overflow: 'hidden',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  twoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  oneButton: {
    marginBottom: 10,
  },
});
