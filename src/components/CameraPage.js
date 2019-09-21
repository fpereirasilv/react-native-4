import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image
} from "react-native";
import * as Permissions from "expo-permissions";
import { Camera } from "expo-camera";

const STORAGE_KEY = "@save_name";

export default class CameraPage extends React.Component {
  camera = null;

  state = {
    captures: [],
    capturing: null,
    cameraType: Camera.Constants.Type.back,
    hasCameraPermission: null,
    photo: profile.photo
  };

  handleShortCapture = async () => {
    if (window.camera) {
      const options = { quality: 0.5, base64: true };
      const photoData = await this.camera.takePictureAsync(options);
      if (photoData) {
        this.setState({
          capturing: false,
          userPhoto: "data:image/jpg;base64," + photo.base6
        });
      }
    }
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
    this.retrieveData();
  }

  save = async photo => {
    try {
      await AsyncStorage.setItem("userImage", photo);
      alert("Data successfully saved!");
      this.setState({ photo });
    } catch (e) {
      alert("Failed to save name.");
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>Sem acesso à câmera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            className="camera-container"
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              window.camera = ref;
            }}
          >
            <View style={{ flex: 1, marginTop: 60 }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                className="camera-close"
              >
                <Image
                  source={require("../../assets/img/close.png")}
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
                  source={require("../../assets/img/flip.png")}
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
                onPress={() => this.save}
                className="camera-shot"
              >
                <Image
                  source={require("../../assets/img/photo.png")}
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
  }
}
