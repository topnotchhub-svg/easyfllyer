/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import { AuthContext } from '../../../lib/AuthContext';
import FlyersComponent from '../../components/Flyers';
import SpecialEventsComponent from '../../components/speical-events';
import { Header } from '../../components/header';
import { Tabs } from '../../components/tabs';
import { CameraView } from '../../components/camera-view';
import CustomAlertBox from '../../components/custom-alert-box';
import Icon from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { deleteUser } from '../../../actions/postal-code/delete-code';
import StoreFlyersComponent from '../../components/store-flyers';
import { GiftCardsComponent } from '../../components/gift-Card';
import BottomBar from '../../components/BottomBar';

const ExploreScreen = ({ navigation }: any) => {
  const { userData, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const toast = useToast();
  const insets = useSafeAreaInsets();

  const handleDeleteUserData = async () => {
    try {
      if (!userData?.postalCode) {
        toast.show('Postal code is missing!', { type: 'danger' });
        return;
      }
      const result = await deleteUser(userData.postalCode, userData.userId);
      if (result.success) {
        toast.show('Account and postal code deleted successfully!', {
          type: 'success',
        });
        logout();
        navigation.reset({ index: 0, routes: [{ name: 'signUp' }] });
      } else {
        toast.show(result.message || 'Failed to delete account.', {
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.show('An error occurred while deleting the account.', {
        type: 'danger',
      });
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 0:
        return activeSubTab === 0 ? (
          <FlyersComponent
            userData={userData}
            mediaLink="https://tinynote.in/ofo/public/assests/baseimg/"
            navigation={navigation}
          />
        ) : (
          <StoreFlyersComponent userData={userData} navigation={navigation} />
        );
      case 1:
        return (
          <SpecialEventsComponent
            userData={userData}
            mediaLink="https://tinynote.in/ofo/public/assests/baseimg/"
            navigation={navigation}
          />
        );
      case 2:
        return (
          <GiftCardsComponent
            // @ts-expect-error demo data
            giftCards={[
              {
                c_id: '1',
                c_name: 'Get 30% discount with this code SAVE30 for today only',
              },
              {
                c_id: '2',
                c_name: 'Get 60% discount with this code GET60 for today only',
              },
              { c_id: '3', c_name: 'Get 50% discount with this code GET50' },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Make sure we’re not drawing under the status bar on Android */}
      <StatusBar
        translucent={false}
        backgroundColor="#F8F8FF"
        barStyle="dark-content"
      />

      {/* TOP safe area (protects header from notch) */}
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.container}>
          <Header
            userData={userData}
            navigation={navigation}
            setAlertVisible={setAlertVisible}
            setIsCameraActive={setIsCameraActive}
          />

          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeSubTab={activeSubTab}
            setActiveSubTab={setActiveSubTab}
          />

          {renderActiveTabContent()}

          <CustomAlertBox
            visible={alertVisible}
            onDismiss={() => setAlertVisible(false)}
            title="Delete Account"
            message="Are you sure you want to delete your account? This action cannot be undone."
            onConfirm={handleDeleteUserData}
            confirmLabel="Delete"
            onCancel={() => setAlertVisible(false)}
            cancelLabel="Cancel"
          />
        </View>
      </SafeAreaView>

      {/* Camera overlay – respect top/bottom insets so it doesn’t hide under notch/home bar */}
      <View
        pointerEvents={isCameraActive ? 'auto' : 'none'}
        style={{
          position: 'absolute',
          top: insets.top,
          bottom: insets.bottom,
          left: 0,
          right: 0,
          zIndex: isCameraActive ? 1 : -1,
        }}
      >
        {isCameraActive && (
          <CameraView
            setIsCameraActive={setIsCameraActive}
            toast={toast}
            userData={userData}
          />
        )}
      </View>

      {/* BOTTOM safe area (protects bottom nav from home indicator) */}
      <SafeAreaView edges={['bottom']} style={styles.safeBottom}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            onPress={() => navigation.navigate('home')}
            style={styles.navItem}
          >
            <Text style={styles.navIcon}>
              <Icon name="home" size={24} color="#000" />
            </Text>
            <Text style={styles.navText}>Browse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('store')}
            style={styles.navItem}
          >
            <Text style={styles.navIcon}>
              <EntypoIcon name="shop" size={24} color="#000" />
            </Text>
            <Text style={styles.navText}>Stores</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('List')}
            style={styles.navItem}
          >
            <Text style={styles.navIcon}>
              <Icon name="list" size={24} color="#000" />
            </Text>
            <Text style={styles.navText}>Lists</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ✅ Use reusable bottom bar */}
      {/* <BottomBar navigation={navigation} /> */}
    </>
  );
};

const styles = StyleSheet.create({
  safeTop: {
    flex: 1,
    backgroundColor: '#F8F8FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
    position: 'relative',
  },
  safeBottom: {
    backgroundColor: '#becbd6',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#becbd6',
    paddingVertical: 10,
  },
  navItem: { alignItems: 'center' },
  navIcon: { color: '#000', fontSize: 20 },
  navText: { color: '#000', fontSize: 12, marginTop: 5 },
});

export default ExploreScreen;
