import React, { useMemo, useRef, useState } from 'react';
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

type Deal = {
  name: string;
  title?: string;
  description?: string;
  validFrom?: string;
  validTo?: string;
  image?: string;
  storeQrCode?: string;
  brandQrCode?: string;
};

const MIN_HEIGHT = 56;
const MAX_HEIGHT = 180;

const isBase64 = (uri?: string) => !!uri && uri.startsWith('data:image/');
const filenameFromUrl = (url: string) =>
  url.split('?')[0].split('/').pop() || 'image';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const parseToDate = (v?: string): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  if (!isNaN(d.getTime())) return d;
  const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const [, y, mo, da] = m;
    const dd = new Date(Number(y), Number(mo) - 1, Number(da));
    return isNaN(dd.getTime()) ? null : dd;
  }
  return null;
};

const fmtFull = (d: Date) =>
  `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

const formatRangeCondensed = (from?: string, to?: string): string => {
  const s = parseToDate(from);
  const e = parseToDate(to);
  if (!s && !e) return '—';
  if (s && !e) return fmtFull(s);
  if (!s && e) return fmtFull(e);

  if (s!.getFullYear() === e!.getFullYear()) {
    const y = s!.getFullYear();
    if (s!.getMonth() === e!.getMonth()) {
      return `${MONTHS[s!.getMonth()]} ${s!.getDate()}–${e!.getDate()}, ${y}`;
    }
    return `${MONTHS[s!.getMonth()]} ${s!.getDate()} – ${
      MONTHS[e!.getMonth()]
    } ${e!.getDate()}, ${y}`;
  }
  return `${fmtFull(s!)} – ${fmtFull(e!)}`;
};

type ValidMeta = {
  rangeLabel: string;
  status: 'active' | 'upcoming' | 'expired';
  statusLabel: string;
};

const computeValidity = (from?: string, to?: string): ValidMeta | null => {
  const start = parseToDate(from);
  const end = parseToDate(to);
  if (!start && !end) return null;

  const now = new Date();
  const endOfDay = end
    ? new Date(
        end.getFullYear(),
        end.getMonth(),
        end.getDate(),
        23,
        59,
        59,
        999,
      )
    : null;

  let status: ValidMeta['status'];
  let statusLabel = '';

  if ((!start || start <= now) && (!end || now <= (endOfDay as Date))) {
    status = 'active';
    statusLabel = `Active · ends ${end ? fmtFull(end) : '—'}`;
  } else if (start && now < start) {
    status = 'upcoming';
    statusLabel = `Starts ${fmtFull(start)}`;
  } else {
    status = 'expired';
    statusLabel = `Expired ${end ? fmtFull(end) : '—'}`;
  }

  return { rangeLabel: formatRangeCondensed(from, to), status, statusLabel };
};

const FlyerScreen = ({ route, navigation }: any) => {
  const deal: Deal = useMemo(
    () => route.params?.deal || {},
    [route.params?.deal],
  );
  const insets = useSafeAreaInsets();

  const animatedHeight = useRef(new Animated.Value(MIN_HEIGHT)).current;
  const [lastScrollY, setLastScrollY] = useState(0);

  const animateBottomSheet = (toValue: number) => {
    Animated.timing(animatedHeight, {
      toValue,
      duration: 280,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    if (currentY > lastScrollY + 16) animateBottomSheet(MAX_HEIGHT);
    else if (currentY < lastScrollY - 16) animateBottomSheet(MIN_HEIGHT);
    setLastScrollY(currentY);
  };

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

  // Image loading states with better error handling
  const [flyerAspect, setFlyerAspect] = useState<number | undefined>(undefined);
  const [qrAspect, setQrAspect] = useState<number | undefined>(1);
  const [imgLoading, setImgLoading] = useState<boolean>(!!deal.image);
  const [qrLoading, setQrLoading] = useState<boolean>(
    !!(deal.storeQrCode || deal.brandQrCode),
  );
  const [imgError, setImgError] = useState<boolean>(false);
  const [qrError, setQrError] = useState<boolean>(false);

  const onImageLoad = (e: any) => {
    const w = e?.nativeEvent?.source?.width;
    const h = e?.nativeEvent?.source?.height;
    if (w && h && h !== 0) {
      setFlyerAspect(w / h);
    }
    setImgLoading(false);
    setImgError(false);
  };

  const onImageError = () => {
    setImgLoading(false);
    setImgError(true);
    console.log('Image failed to load:', deal.image);
  };

  const onQrLoad = (e: any) => {
    const w = e?.nativeEvent?.source?.width;
    const h = e?.nativeEvent?.source?.height;
    if (w && h && h !== 0) {
      setQrAspect(w / h);
    }
    setQrLoading(false);
    setQrError(false);
  };

  const onQrError = () => {
    setQrLoading(false);
    setQrError(true);
    console.log(
      'QR code failed to load:',
      deal.storeQrCode || deal.brandQrCode,
    );
  };

  const handleShare = async () => {
    try {
      let filePath: string | undefined;
      if (deal.image) {
        if (isBase64(deal.image)) {
          const base64Data = deal.image.replace(/^data:image\/\w+;base64,/, '');
          const ext =
            deal.image.match(/^data:image\/(\w+);base64,/)?.[1] || 'png';
          filePath = `${RNFS.CachesDirectoryPath}/flyer.${ext}`;
          await RNFS.writeFile(filePath, base64Data, 'base64');
        } else {
          const fname = filenameFromUrl(deal.image);
          filePath = `${RNFS.CachesDirectoryPath}/${fname}`;
          if (!(await RNFS.exists(filePath))) {
            await RNFS.downloadFile({ fromUrl: deal.image, toFile: filePath })
              .promise;
          }
        }
      }

      await Share.share({
        message: `Check out this deal: ${deal.title || deal.name}\nValid: ${
          deal.validFrom || ''
        } to ${
          deal.validTo || ''
        }\n\nGet the app here:\nhttps://play.google.com/store/apps/details?id=com.jspromotionalatestversion`,
        url: filePath ? `file://${filePath}` : undefined,
      });
    } catch (err: any) {
      console.error('Error sharing flyer:', err?.message || err);
    }
  };

  const qrUri = useMemo(() => deal.storeQrCode || deal.brandQrCode, [deal]);
  const validMeta = computeValidity(deal.validFrom, deal.validTo);

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
            {deal.name || 'Flyer'}
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

        {/* Info */}
        <View style={styles.storeInfo}>
          {!!deal.title && <Text style={styles.storeTitle}>{deal.title}</Text>}
          {!!deal.description && (
            <Text style={styles.description}>{deal.description}</Text>
          )}

          {/* Validity */}
          {validMeta && (
            <View style={styles.validBlock}>
              <View style={styles.validRow}>
                <Icon name="event" size={18} color="#0B274A" />
                <Text style={styles.validRangeText}>
                  Valid: {validMeta.rangeLabel}
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
                  name={
                    validMeta.status === 'active'
                      ? 'check-circle'
                      : validMeta.status === 'upcoming'
                      ? 'schedule'
                      : 'error-outline'
                  }
                  size={14}
                  style={styles.chipIcon}
                  color={
                    validMeta.status === 'active'
                      ? '#177245'
                      : validMeta.status === 'upcoming'
                      ? '#2B5FDB'
                      : '#C1352A'
                  }
                />
                <Text
                  style={[
                    styles.chipText,
                    validMeta.status === 'active' && styles.chipTextActive,
                    validMeta.status === 'upcoming' && styles.chipTextUpcoming,
                    validMeta.status === 'expired' && styles.chipTextExpired,
                  ]}
                  numberOfLines={1}
                >
                  {validMeta.statusLabel}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Content */}
        <ScrollView
          style={styles.flyerContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: MAX_HEIGHT + insets.bottom + 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Flyer image with optimized loading */}
          {!!deal.image && (
            <View style={styles.flyerSection}>
              <View style={styles.imageWrap}>
                {imgLoading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4C6EF5" />
                    <Text style={styles.loadingText}>Loading image...</Text>
                  </View>
                )}

                {!imgError ? (
                  <Image
                    source={{
                      uri: deal.image,
                      cache: 'force-cache',
                    }}
                    onLoad={onImageLoad}
                    onError={onImageError}
                    onLoadStart={() => setImgLoading(true)}
                    style={[
                      styles.flyerImage,
                      flyerAspect
                        ? { aspectRatio: flyerAspect }
                        : styles.flyerImageFallback,
                    ]}
                    resizeMode="contain"
                    accessible
                    accessibilityLabel="Flyer image"
                  />
                ) : (
                  <View style={styles.errorContainer}>
                    <Icon name="broken-image" size={48} color="#ccc" />
                    <Text style={styles.errorText}>Image not available</Text>
                    <TouchableOpacity
                      style={styles.retryButton}
                      onPress={() => {
                        setImgError(false);
                        setImgLoading(true);
                      }}
                    >
                      <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <Text style={styles.flyerSubText}>
                Explore exclusive deals and offers available for {deal.name}.
              </Text>
            </View>
          )}

          {/* QR code with optimized loading */}
          <View style={styles.qrCodeContainer}>
            {qrUri ? (
              <>
                <Text style={styles.qrCodeTitle}>Scan QR Code to Redeem</Text>
                <View style={styles.qrWrap}>
                  {qrLoading && (
                    <View style={styles.qrLoadingContainer}>
                      <ActivityIndicator size="small" color="#4C6EF5" />
                      <Text style={styles.qrLoadingText}>Loading QR...</Text>
                    </View>
                  )}

                  {!qrError ? (
                    <Image
                      source={{
                        uri: qrUri,
                        cache: 'force-cache',
                      }}
                      onLoad={onQrLoad}
                      onError={onQrError}
                      onLoadStart={() => setQrLoading(true)}
                      style={[
                        styles.qrCodeImage,
                        qrAspect ? { aspectRatio: qrAspect } : undefined,
                      ]}
                      resizeMode="contain"
                      accessible
                      accessibilityLabel="QR code"
                    />
                  ) : (
                    <View style={styles.qrErrorContainer}>
                      <Icon name="qr-code-2" size={32} color="#ccc" />
                      <Text style={styles.qrErrorText}>QR not available</Text>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                          setQrError(false);
                          setQrLoading(true);
                        }}
                      >
                        <Text style={styles.retryText}>Retry</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <Text style={styles.qrCodeTitle}>QR Code not available</Text>
            )}
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
              {deal.name || 'Flyer'}
            </Text>
          </View>
          <View style={styles.sheetActions}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.shareDealButton}
              activeOpacity={0.9}
            >
              <Text style={styles.shareDealText}>Share Deal</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

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

  storeInfo: { paddingHorizontal: 15, paddingBottom: 8 },
  storeTitle: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: { fontSize: 14, color: '#555' },

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
  chipTextActive: { color: '#0E5A36' },
  chipTextUpcoming: { color: '#214AB6' },
  chipTextExpired: { color: '#9E2E24' },

  flyerContent: { paddingHorizontal: 12 },
  flyerSection: { marginBottom: 18, alignItems: 'center' },

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

  flyerImage: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#e8e8e8',
  },
  flyerImageFallback: {
    height: 400,
  },
  flyerSubText: {
    color: '#000',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
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

  qrCodeContainer: { alignItems: 'center', marginVertical: 20 },
  qrCodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  qrWrap: { width: '60%', maxWidth: 260, alignItems: 'center', minHeight: 120 },
  qrCodeImage: { width: '100%' },

  qrLoadingContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  qrLoadingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },

  qrErrorContainer: {
    width: '100%',
    height: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  qrErrorText: {
    marginTop: 4,
    fontSize: 12,
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
  shareDealButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4C6EF5',
  },
  shareDealText: { color: '#4C6EF5', fontSize: 14, fontWeight: 'bold' },
});

export default FlyerScreen;
