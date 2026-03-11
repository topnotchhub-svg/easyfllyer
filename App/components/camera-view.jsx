
import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { Text } from 'react-native-paper';
import Overlay from './overlay'; // Custom overlay component
import { UpdateCountView } from '../../actions/update-count';

export const CameraView = ({ setIsCameraActive, toast, userData }) => {
  const postalCode = userData.postalCode;
  const userId = userData?.userId;
  const camera = useRef(null);
  const device = useCameraDevice('back');
  const [isScanning, setIsScanning] = useState(true); // State to control scanning

  useEffect(() => {
    checkPermissions();
  }, []);

  // Permission checking function
  const checkPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();
    console.log('Camera Permission:', cameraPermission);
    console.log('Microphone Permission:', microphonePermission);

    if (cameraPermission !== 'granted' || microphonePermission !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Camera and Microphone permissions are required to use this app.'
      );
    }
  };

  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr', 'ean-13'],
  //   onCodeScanned: (codes) => {
  //     if (isScanning && codes.length > 0) {
  //       setIsScanning(false); // Stop further scanning
  //       const qrData = codes[0].value; // Access the data safely
  //       console.log(`Scanned QR Code: ${qrData}`);

  //       // Show an alert with the QR code data
  //       Alert.alert('QR Code Scanned', `Data: ${qrData}`, [
  //         {
  //           text: 'OK',
  //           onPress: () => setIsScanning(true), // Resume scanning after alert is dismissed
  //         },
  //       ]);
  //     }
  //   },
  // });

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: async (codes) => {
      if (isScanning && codes.length > 0) {
        setIsScanning(false); // Stop further scanning
        const qrData = codes[0].value; // Access the data safely
        console.log(`Scanned QR Code: ${qrData}`);

        // Call the UpdateCountView function and pass the scanned value
        const result = await UpdateCountView({ scannedValue: qrData , userId : userId , postalCode : postalCode });
        if (result.error) {
          // Handle error if any
          console.error(result.error);
        } else {
          console.log(result.success);
        }

        // Show an alert with the QR code data
        Alert.alert('QR Code Scanned', `Data: ${qrData}`, [
          {
            text: 'OK',
            onPress: () => setIsScanning(true), // Resume scanning after alert is dismissed
          },
        ]);
      }
    },
  });

  if (!device) {
    return (
      <View style={styles.cameraContainer}>
        <Text style={styles.errorText}>
          Camera device not available. Please check your device or permissions.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => setIsCameraActive(false)}>
          <Text style={styles.backButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      {/* Full-Screen Camera */}
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
        codeScanner={codeScanner}
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setIsCameraActive(false)}
      >
        <Text style={styles.backButtonText}>Close</Text>
      </TouchableOpacity>

      {/* Overlay */}
      <Overlay />
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    position: 'relative', // Ensure child elements are positioned relative to this container
    height : '100%',
    width : '100%',
    zIndex : 1000,
  },
  backButton: {
    position: 'absolute',
    top: 20, // Adjust to position the button
    left: 20, // Adjust to position the button
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for better visibility
    padding: 10,
    borderRadius: 5,
    zIndex: 10, // Ensure the button is above other components
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    margin: 20,
    color: 'red',
  },
});
