import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import axios from "axios";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

interface Article {
  title: string;
  description: string;
  urlToImage: string | null;
}

export default function Home() {
  const [countryName, setCountryName] = useState<string>("");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingWeather, setLoadingWeather] = useState<boolean>(false);
  const [loadingNews, setLoadingNews] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch Weather Data from OpenWeatherMap API
  const fetchWeatherData = async () => {
    if (countryName.trim() === "") return; // Do not fetch if input is empty
    setLoadingWeather(true);
    setError(""); // Clear any previous errors

    try {
      const apiKey = "dfd9956300ca690606a7b1b5ca861bd2"; // Replace with your OpenWeatherMap API key
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${apiKey}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      setError("Error fetching weather data. Please try again.");
    } finally {
      setLoadingWeather(false);
    }
  };

  // Fetch News Data from News API (for the United States)
  const fetchNewsData = async () => {
    setLoadingNews(true);

    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country: "us", // United States
          apiKey: "1c166d716fab40578c95d687dce8143b", // Replace with your News API key
        },
      });
      setArticles(response.data.articles || []);
    } catch (error) {
      setError("Error fetching news data. Please try again.");
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNewsData(); // Fetch the news once the component is mounted
  }, []);

  // Handle the "Get Weather" button press
  const handleGetWeather = () => {
    fetchWeatherData(); // Fetch the weather data for the entered country
  };

  // Render Article for News API
  const renderArticle = ({ item }: { item: Article }) => (
    <View style={styles.article}>
      <Image
        source={{ uri: item.urlToImage || "https://via.placeholder.com/150" }}
        style={styles.articleImage}
      />
      <View style={styles.articleTextContainer}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articleDescription} numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <Text style={styles.navBarText}>Weather & News Updates</Text>
      </View>

      {/* Country Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter country name..."
          style={styles.input}
          value={countryName}
          onChangeText={setCountryName}
        />
        <TouchableOpacity style={styles.button} onPress={handleGetWeather}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>
      </View>

      {/* Weather Data */}
      {loadingWeather ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : weatherData ? (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherTitle}>
            Weather in {weatherData.name}, {weatherData.sys.country}
          </Text>
          
          {/* Weather Icon */}
          <View style={styles.weatherIconContainer}>
            <Image
              source={{
                uri: `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
              }}
              style={styles.weatherIcon}
            />
          </View>
          
          <Text style={styles.weatherDetails}>
            Temperature: {weatherData.main.temp}°C
          </Text>
          <Text style={styles.weatherDetails}>
            Humidity: {weatherData.main.humidity}%
          </Text>
          <Text style={styles.weatherDetails}>
            Condition: {weatherData.weather[0].description}
          </Text>
        </View>
      ) : null}

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* News Data */}
      {loadingNews ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : (
        <FlatList
          data={articles}
          renderItem={renderArticle}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  navBar: {
    height: 70,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  navBarText: {
    color: "#FFFFFF",
    fontSize: width > 400 ? 24 : 20,
    fontWeight: "bold",
  },
  inputContainer: {
    padding: width > 400 ? 20 : 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: width > 400 ? 20 : 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FAFAFA",
    fontSize: 16,
    flex: 1,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 12,
    borderRadius: 30,
    marginLeft: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  weatherContainer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: width > 400 ? 20 : 15,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherTitle: {
    fontSize: width > 400 ? 22 : 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  weatherDetails: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  weatherIconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  weatherIcon: {
    width: 80,  // Increased size
    height: 80, // Increased size
  },
  content: {
    paddingBottom: 20,
  },
  article: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginHorizontal: width > 400 ? 20 : 15,
  },
  articleImage: {
    width: width > 400 ? 150 : 120,
    height: width > 400 ? 150 : 120,
    borderRadius: 8,
    marginRight: 10,
  },
  articleTextContainer: {
    flex: 1,
    padding: 15,
  },
  articleTitle: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  articleDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
