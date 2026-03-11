import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const squareSize = 250; // Size of the transparent square

const Overlay = () => {
  return (
    <View style={styles.overlayContainer}>
      {/* Top overlay */}
      <View style={[styles.overlay, styles.topOverlay]} />

      {/* Middle row with the transparent square in the center */}
      <View style={styles.middleContainer}>
        <View style={styles.overlay} />
        <View style={styles.holeContainer}>
          {/* Transparent square without border */}
          <View style={styles.hole}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>
        <View style={styles.overlay} />
      </View>

      {/* Bottom overlay */}
      <View style={[styles.overlay, styles.bottomOverlay]} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker background for better contrast
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent dark overlay
  },
  topOverlay: {
    flex: (height - squareSize) / 2 / height,
  },
  middleContainer: {
    flexDirection: 'row',
    height: squareSize,
  },
  holeContainer: {
    width: squareSize,
    height: squareSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hole: {
    width: squareSize,
    height: squareSize,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 8, // Rounded corner
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#FFFFFF',
    borderTopRightRadius: 8, // Rounded corner
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#FFFFFF',
    borderBottomLeftRadius: 8, // Rounded corner
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#FFFFFF',
    borderBottomRightRadius: 8, // Rounded corner
  },
  bottomOverlay: {
    flex: (height - squareSize) / 2 / height,
  },
});

export default Overlay;
