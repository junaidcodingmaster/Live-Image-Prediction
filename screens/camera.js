import * as React from "react";
import { Button, Image, View, Platform, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class PickImage extends React.Component {
  state = {
    image: null,
    imageLocal: "",
    imageSelected: false,
    imageUploaded: false,
    server:"https://2bc6-103-236-193-178.in.ngrok.io/predict-alphabet"
  };

  render() {
    let { image, imageLocal, imageSelected, imageUploaded } = this.state;

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {this.state.imageSelected === true ? (
          <Image
            source={{ uri: this.state.imageLocal }}
            style={{ height: 300, width: 300 }}
          />
        ) : (
          <View style={{ height: 0, width: 0 }} />
        )}
        {this.state.imageSelected === true ? (
          <Text>
            {this.state.imageUploaded === true
              ? "\nYou Image is Uploaded !\n"
              : "\nYour Image is uploading...\n"}
          </Text>
        ) : (
          <View style={{ height: 0, width: 0 }} />
        )}
        <Button
          title="Pick an image from camera roll"
          onPress={this._pickImage}
        />
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    }
  };

  uploadImage = async (uri) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      alphabet: uri.toString(),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(
      this.state.server,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        alert("Your Image is uploaded ! - "+result);
        this.setState({ imageUploaded: true });
      })
      .catch((error) => Alert.alert("Error", error));
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ imageLocal: result.uri, imageSelected: true });
        this.uploadImage(result.uri);
      }
    } catch (E) {
      console.log(E);
    }
  };
}
