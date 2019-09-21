import React from "react";
import moment from "moment";
import { AsyncStorage } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  StatusBar
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

const profile = {
  picture:
    "https://secure.gravatar.com/avatar/f50a9db56e231198af3507f10b5d5491?d=mm",
  email: "rafael.fuzifaru@gmail.com",
  first_name: "Rafael",
  last_name: "Fuzifaru Cianci",
  phone: "(48) 99110-3535",
  gender: 1,
  birthday: "1993-04-27T00:00:00-03:00",
  linkedin: "https://www.linkedin.com/in/rafaelcianci",
  github: "http://github.com/rafacianci",
  address: {
    Street: "",
    ZipCode: "",
    Number: "",
    ComplementaryAddress: ""
  },
  language: ["Português - PT", "Inglês - EN", "Japonês - JA"],
  name: "Rafael Fuzifaru Cianci"
};

export default class Profile extends React.PureComponent {
  fadeAnimation = new Animated.Value(0);

  state = {
    loading: true,
    openCaptures: false,
    type: Camera.Constants.Type.back,
    hasCameraPermission: null,
    photo: profile.picture
  };

  retrieveData = async () => {
    try {
      const getPhoto = await AsyncStorage.getItem("userImage");
      this.setState({ photo: getPhoto ? getPhoto : profile.picture });
    } catch (e) {
      alert("Falha ao carregar foto.");
    }
  };

  takePicture = async () => {
    if (window.camera) {
      let photoData = await window.camera.takePictureAsync({ base64: true });
      if (photoData) {
        try {
          this.setState({
            openCaptures: false,
            photo: "data:image/jpg;base64," + photoData.base64
          });
          await AsyncStorage.setItem(
            "userImage",
            "data:image/jpg;base64," + photoData.base64
          );
          this.finishLoading();
        } catch {
          alert("Falha ao gravar foto.");
        }
      }
    }
  };

  componentWillMount() {
    const getValue = AsyncStorage.getItem("userImage") || profile.picture;
    this.setState.photo = getValue;
  }

  async componentDidMount() {
    this.finishLoading();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
    try {
      await AsyncStorage.setItem(
        "userImage",
        this.state.photo || profile.picture
      );
    } catch (error) {
      alert("houve um problema ao salvar a foto.");
    }
  }

  finishLoading = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      Animated.timing(this.fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }).start();

      this.setState({ loading: false });
    } catch (error) {
      console.error(error);
    }
  };

  showCamera = visible => {
    this.setState({ openCaptures: visible });
  };

  closeCamera = visible => {
    setInterval(() => {
      this.setState({
        openCaptures: visible
      });
      this.finishLoading();
    }, 600);
  };

  render() {
    let screenProfile = (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            className="header-image"
            style={styles.headerImage}
            source={{
              uri:
                "https://forum.codenation.com.br/uploads/default/original/2X/2/2d2d2a9469f0171e7df2c4ee97f70c555e431e76.png"
            }}
          />
        </View>
        <View style={styles.profileTitle}>
          <TouchableOpacity
            className="profile-image-btn"
            onPress={() => this.showCamera(true)}
          >
            <Image
              className="profile-image"
              style={styles.profileImage}
              source={{ uri: this.state.photo }}
            />
          </TouchableOpacity>
          <Text className="profile-name" style={styles.profileName}>
            {profile.name}
          </Text>
        </View>
        {this.state.loading && (
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#7800ff" />
          </View>
        )}
        {!this.state.loading && (
          <ScrollView>
            <Animated.View
              className="contact-content"
              style={[styles.userContent, { opacity: this.fadeAnimation }]}
            >
              <Text className="contact-label" style={styles.contentLabel}>
                Linkedin:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.linkedin}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Github:
              </Text>
              <Text className="contact-value" style={styles.contentText}>
                {profile.github}
              </Text>
            </Animated.View>
            <Animated.View
              className="contact-content"
              style={[styles.userContent, { opacity: this.fadeAnimation }]}
            >
              <Text className="contact-label" style={styles.contentLabel}>
                E-mail:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.email}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Celular:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.phone}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Data de Nascimento:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {moment(profile.birthday).format("DD/MM/YYYY")}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Sexo:
              </Text>
              <Text
                className="contact-value"
                style={{ ...styles.contentText, ...styles.mBottom }}
              >
                {profile.gender === 1 ? "Masculino" : "Feminino"}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>
                Idiomas:
              </Text>
              <View style={styles.languageContent}>
                {profile.language.map(language => (
                  <View key={language} style={styles.language}>
                    <Text
                      className="contact-language"
                      style={styles.languageText}
                    >
                      {language}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </ScrollView>
        )}
      </View>
    );

    if (this.state.openCaptures) {
      screenProfile = (
        <View style={{ flex: 1 }}>
          <StatusBar className="status-bar" hidden={true} />
          <Camera
            className="camera-container"
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              window.camera = ref;
              window.camera = ref;
            }}
          >
            <View style={{ flex: 1, marginTop: 60 }}>
              <TouchableOpacity
                className="camera-close"
                onPress={() => {
                  this.closeCamera(false);
                }}
              >
                <Image
                  source={require("../../assets/close.png")}
                  style={{
                    marginTop: 10,
                    marginLeft: 10,
                    width: 24,
                    height: 24
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center"
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Image
                  source={require("../../assets/flip.png")}
                  style={{
                    marginLeft: 20,
                    marginBottom: 10,
                    width: 48,
                    height: 48
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                className="camera-shot"
                onPress={() => this.takePicture()}
              >
                <Image
                  source={require("../../assets/photo.png")}
                  style={{
                    marginLeft: 20,
                    marginBottom: 10,
                    width: 64,
                    height: 64
                  }}
                />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
    return screenProfile;
  }
}

const styles = StyleSheet.create({
  loadingContent: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    borderBottomColor: "#7800ff",
    borderBottomWidth: 2,
    padding: 16,
    paddingTop: 55
  },
  headerImage: {
    height: 45,
    width: 250
  },
  title: {
    color: "#7800ff",
    fontSize: 30,
    padding: 16
  },
  profileTitle: {
    alignItems: "center",
    flexDirection: "row",
    padding: 16
  },
  profileImage: {
    borderRadius: 22,
    height: 45,
    width: 45
  },
  profileName: {
    color: "#7800ff",
    fontSize: 20,
    paddingLeft: 16
  },
  userContent: {
    backgroundColor: "#000",
    borderRadius: 2,
    margin: 16,
    padding: 16,
    marginTop: 0
  },
  contentLabel: {
    color: "#FFFFFF",
    fontSize: 11
  },
  contentText: {
    color: "#FFFFFF",
    fontSize: 14
  },
  mBottom: {
    marginBottom: 16
  },
  languageContent: {
    alignItems: "center",
    flexDirection: "row"
  },
  language: {
    backgroundColor: "#666",
    borderRadius: 50,
    marginRight: 16,
    marginTop: 8
  },
  languageText: {
    color: "#FFFFFF",
    fontSize: 14,
    padding: 5,
    paddingHorizontal: 5
  }
});
