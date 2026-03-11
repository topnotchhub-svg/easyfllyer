import React from 'react';
import {StyleSheet} from 'react-native';
import {Modal, Portal, Text, Button, Card} from 'react-native-paper';

interface CustomAlertBoxProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
}

const CustomAlertBox = ({
  visible,
  onDismiss,
  title,
  message,
  onConfirm,
  confirmLabel = 'OK',
  onCancel,
  cancelLabel = 'Cancel',
}: CustomAlertBoxProps) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}>
        <Card style={styles.card}>
          {/* Title */}
          {title && <Text style={styles.title}>{title}</Text>}

          {/* Message */}
          {message && <Text style={styles.message}>{message}</Text>}

          {/* Action Buttons */}
          <Card.Actions style={styles.actions}>
            {onCancel && (
              <Button mode="text" onPress={onCancel} style={styles.button}>
                {cancelLabel}
              </Button>
            )}
            {onConfirm && (
              <Button
                mode="contained"
                onPress={onConfirm}
                style={styles.button}>
                {confirmLabel}
              </Button>
            )}
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    borderRadius: 10,
    // backgroundColor: '#FFFFFF',
    padding: 10,
  },
  card: {
    borderRadius: 10,
    // backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#4A5568',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#718096',
  },
  actions: {
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    marginHorizontal: 5,
  },
});

export default CustomAlertBox;
