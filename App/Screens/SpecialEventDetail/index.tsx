import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Animated,
  Easing,
  PanResponder,
  Share,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { formatDate } from '../../components/store-flyers';

type SpecialEvent = {
  id: string;
  name: string;
  description: string;
  brandId?: string;
  storeId?: string;
  image: string | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  brand?: Record<string, any>;
  store?: Record<string, any>;
};

/* -------------------- Config -------------------- */
const MIN_HEIGHT = 56;
const MAX_HEIGHT = 120;

/* -------------------- Utils -------------------- */
const isBase64 = (uri?: string | null) =>
  !!uri && uri.startsWith('data:image/');
const filenameFromUrl = (url: string) =>
  url.split('?')[0].split('/').pop() || 'event-image';

const computeValidity = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return {
      status: 'upcoming' as const,
      label: `Starts ${formatDate(startDate)}`,
      icon: 'schedule',
      color: '#2563EB',
    };
  } else if (now > end) {
    return {
      status: 'expired' as const,
      label: `Expired ${formatDate(endDate)}`,
      icon: 'event-busy',
      color: '#DC2626',
    };
  } else {
    return {
      status: 'active' as const,
      label: 'Active Now',
      icon: 'event-available',
      color: '#16A34A',
    };
  }
};

/* -------------------- Screen -------------------- */
const SpecialEventDetailScreen = ({ route, navigation }: any) => {
  const event: SpecialEvent = route.params?.event || {};
  const insets = useSafeAreaInsets();

  /** Bottom sheet animation */
  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
  const [lastScrollY, setLastScrollY] = useState(0);

  /** Image loading states with better error handling */
  const [imageAspect, setImageAspect] = useState<number | undefined>(undefined);
  const [imgLoading, setImgLoading] = useState<boolean>(!!event.image);
  const [imgError, setImgError] = useState<boolean>(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => animatedHeight.stopAnimation(),
      onPanResponderMove: (_evt, g) => {
        const next = Math.max(
          MIN_HEIGHT,
          Math.min(MAX_HEIGHT, MAX_HEIGHT - g.dy),
        );
        animatedHeight.setValue(next);
      },
      onPanResponderRelease: (_evt, g) => {
        if (g.dy > 40) animateBottomSheet(MIN_HEIGHT);
        else animateBottomSheet(MAX_HEIGHT);
      },
    }),
  ).current;

  const animateBottomSheet = (toValue: number) => {
    Animated.timing(animatedHeight, {
      toValue,
      duration: 280,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleScroll = (
    scrollEvent: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const currentY = scrollEvent.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY + 16) animateBottomSheet(MAX_HEIGHT);
    else if (currentY < lastScrollY - 16) animateBottomSheet(MIN_HEIGHT);
    setLastScrollY(currentY);
  };

  const handleImageLoad = (loadEvent: any) => {
    const { width, height } = loadEvent.nativeEvent.source;
    if (width && height && height !== 0) {
      setImageAspect(width / height);
    }
    setImgLoading(false);
    setImgError(false);
  };

  const handleImageError = () => {
    setImgLoading(false);
    setImgError(true);
    console.log('Image failed to load:', event.image);
  };

  const handleImageLoadStart = () => {
    setImgLoading(true);
    setImgError(false);
  };

  const handleShare = async () => {
    try {
      let filePath: string | undefined;
      if (event.image) {
        if (isBase64(event.image)) {
          const base64Data = event.image.replace(
            /^data:image\/\w+;base64,/,
            '',
          );
          const ext =
            event.image.match(/^data:image\/(\w+);base64,/)?.[1] || 'png';
          filePath = `${RNFS.CachesDirectoryPath}/event.${ext}`;
          await RNFS.writeFile(filePath, base64Data, 'base64');
        } else {
          const fname = filenameFromUrl(event.image);
          filePath = `${RNFS.CachesDirectoryPath}/${fname}`;
          if (!(await RNFS.exists(filePath))) {
            await RNFS.downloadFile({ fromUrl: event.image, toFile: filePath })
              .promise;
          }
        }
      }

      await Share.share({
        message: `Check out this special event: ${
          event.name
        }\nValid: ${formatDate(event.startDate)} to ${formatDate(
          event.endDate,
        )}\n\nGet the app here:\nhttps://play.google.com/store/apps/details?id=com.jspromotionalatestversion`,
        url: filePath ? `file://${filePath}` : undefined,
      });
    } catch (err: any) {
      console.error('Error sharing event:', err?.message || err);
    }
  };

  const validMeta = computeValidity(event.startDate, event.endDate);

  // Check if we have valid event data
  if (!event.id) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Event Not Found
            </Text>
            <View style={styles.headerIcons} />
          </View>
          <View style={styles.errorContainerFull}>
            <Icon name="error-outline" size={64} color="#ccc" />
            <Text style={styles.errorTextFull}>Event data not available</Text>
            <Text style={styles.errorSubText}>
              The event you're looking for could not be loaded.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeTop}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {event.name}
          </Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={handleShare}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Icon name="share" size={22} color="#000" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Icon
                name="more-vert"
                size={22}
                color="#000"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.name}</Text>

          {/* Brand/Store Info */}
          {(event.brand?.name || event.store?.name) && (
            <View style={styles.brandInfo}>
              <Text style={styles.brandLabel}>
                {event.store?.name ? 'Store' : 'Brand'}:
              </Text>
              <Text style={styles.brandName}>
                {event.store?.name || event.brand?.name}
              </Text>
            </View>
          )}

          {/* Store Address if available */}
          {event.store?.address && (
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Address:</Text>
              <Text style={styles.addressText}>{event.store.address}</Text>
            </View>
          )}

          {/* Description */}
          {event.description && (
            <Text style={styles.description}>{event.description}</Text>
          )}

          {/* Validity Status */}
          <View style={styles.validBlock}>
            <View style={styles.validRow}>
              <Text style={styles.validRangeText}>
                Valid: {formatDate(event.startDate)} -{' '}
                {formatDate(event.endDate)}
              </Text>
            </View>
            <View
              style={[
                styles.statusChip,
                validMeta.status === 'active' && styles.chipActive,
                validMeta.status === 'upcoming' && styles.chipUpcoming,
                validMeta.status === 'expired' && styles.chipExpired,
              ]}
            >
              <Icon
                name={validMeta.icon}
                size={14}
                color={validMeta.color}
                style={styles.chipIcon}
              />
              <Text style={[styles.chipText, { color: validMeta.color }]}>
                {validMeta.label}
              </Text>
            </View>
          </View>
        </View>

        {/* Event Image */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.eventContent}>
            <View style={styles.imageSection}>
              <View style={styles.imageWrap}>
                {imgLoading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4C6EF5" />
                    <Text style={styles.loadingText}>Loading image...</Text>
                  </View>
                )}

                {event.image && !imgError ? (
                  <Image
                    source={{
                      uri: event.image,
                      cache: 'force-cache',
                    }}
                    style={[
                      styles.eventImage,
                      imageAspect ? { aspectRatio: imageAspect } : undefined,
                    ].filter(Boolean)}
                    resizeMode="cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    onLoadStart={handleImageLoadStart}
                    accessible
                    accessibilityLabel="Event image"
                  />
                ) : (
                  <View style={styles.errorContainer}>
                    <Icon name="broken-image" size={48} color="#ccc" />
                    <Text style={styles.errorText}>
                      {imgError ? 'Image not available' : 'No image provided'}
                    </Text>
                    {imgError && (
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                          setImgError(false);
                          setImgLoading(true);
                        }}
                      >
                        <Text style={styles.retryText}>Retry</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Additional event details can be shown here */}
              {event.brand?.description && (
                <Text style={styles.imageSubText}>
                  {event.brand.description}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Sheet */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.bottomSheet,
            {
              height: Animated.add(
                animatedHeight,
                new Animated.Value(insets.bottom),
              ),
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <View style={styles.centerLine} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle} numberOfLines={1}>
              {event.name}
            </Text>
          </View>
          <View style={styles.sheetActions}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.shareEventButton}
              activeOpacity={0.9}
            >
              <Icon
                name="share"
                size={16}
                color="#4C6EF5"
                style={styles.shareIcon}
              />
              <Text style={styles.shareEventText}>Share Event</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

/* -------------------- Styles -------------------- */
const styles = StyleSheet.create({
  safeTop: { flex: 1, backgroundColor: '#F8F8FF' },
  container: { flex: 1, backgroundColor: '#F8F8FF' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 14,
  },
  headerTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 10,
  },
  headerIcons: { flexDirection: 'row' },
  icon: { marginLeft: 12 },

  eventInfo: { paddingHorizontal: 15, paddingBottom: 8 },
  eventTitle: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginRight: 8,
  },
  brandName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginRight: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },

  /* Validity UI */
  validBlock: { marginTop: 8 },
  validRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  validRangeText: { color: '#0B2239', fontSize: 14, fontWeight: '600' },
  statusChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#F4F6FA',
    borderColor: '#D8E0ED',
  },
  chipIcon: { marginRight: 6 },
  chipText: { fontSize: 12, fontWeight: '600' },
  chipActive: { backgroundColor: '#E9F7EF', borderColor: '#CFEBDC' },
  chipUpcoming: { backgroundColor: '#EEF3FF', borderColor: '#D8E2FF' },
  chipExpired: { backgroundColor: '#FFEDEE', borderColor: '#F9D2D5' },

  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 200 },
  eventContent: { paddingHorizontal: 12 },
  imageSection: { marginBottom: 18, alignItems: 'center' },

  imageWrap: { width: '100%', position: 'relative', minHeight: 200 },

  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },

  eventImage: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#e8e8e8',
  },

  errorContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4C6EF5',
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  imageSubText: {
    color: '#000',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#293B4F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -6 },
      },
      android: { elevation: 12 },
    }),
  },
  centerLine: {
    width: 40,
    height: 5,
    backgroundColor: '#B7C0CA',
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sheetActions: { flexDirection: 'row', justifyContent: 'space-between' },
  shareEventButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4C6EF5',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareIcon: {
    marginRight: 6,
  },
  shareEventText: { color: '#4C6EF5', fontSize: 14, fontWeight: 'bold' },

  errorContainerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorTextFull: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SpecialEventDetailScreen;
