import { BLOGS } from '@/constants';
import { useScaleFont } from '@/hooks/useFontScale';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { JSX, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { ThemedText } from '../ThemedText';
import TimeFlow from './TimeFlow';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const isWeb = Platform.OS === 'web';

interface FlowBarProps {
  currentIndex: SharedValue<number>;
  progress: SharedValue<number>;
  scrollHeight: SharedValue<number>;
  totalSections: number;
  blogData?: (typeof BLOGS)[0];
}

const PEEK_VIEW_HEIGHT = 50;
const FULL_VIEW_HEIGHT = 32;
const FULL_VIEW_COVER_HEIGHT = 70;
const FULL_BAR_HEIGHT = 260;
const TIMING_CONFIG = { duration: 250, easing: Easing.out(Easing.ease) };
const SPRING_CONFIG = {
  damping: 18,
  mass: 0.5,
  stiffness: 180,
};

const WORDS_PER_MINUTE = 200;

export default function FlowBar({
  currentIndex,
  progress,
  scrollHeight,
  totalSections,
  blogData,
}: FlowBarProps) {
  const backgroundColor = '#000000';
  const scaleFont = useScaleFont();
  const [isExpanded, setIsExpanded] = useState(false);

  const { SECTIONS_TITLE, TOTAL_TIME } = useMemo(() => {
    if (!blogData?.sections) {
      return {
        SECTIONS_TITLE: [],
        TOTAL_TIME: 0,
      };
    }

    const sectionsTitle = blogData.sections.map(section => section.title);
    const totalWords = blogData.sections.reduce((acc, section) => {
      return acc + section.content.join(' ').split(/\s+/).length;
    }, 0);
    const totalTime = Math.ceil(totalWords / WORDS_PER_MINUTE);

    return {
      SECTIONS_TITLE: sectionsTitle,
      TOTAL_TIME: totalTime,
    };
  }, [blogData?.sections]);

  const scrollProgress = useDerivedValue(() => {
    const progressValue = progress?.value ?? 0;
    return Math.max(0, progressValue);
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isExpanded ? '93%' : '80%', SPRING_CONFIG),
      height: withSpring(
        isExpanded ? FULL_BAR_HEIGHT : PEEK_VIEW_HEIGHT,
        SPRING_CONFIG
      ),
      borderRadius: withSpring(isExpanded ? 38 : 60, SPRING_CONFIG),
      borderTopLeftRadius: withSpring(isExpanded ? 30 : 60, SPRING_CONFIG),
      borderTopRightRadius: withSpring(isExpanded ? 30 : 60, SPRING_CONFIG),
    };
  });

  const scrollTitleViewStyle = useAnimatedStyle(() => {
    const indexValue = currentIndex?.value ?? 0;
    const safeTotalSections = Math.max(1, totalSections || 1);

    const translateY = withSpring(
      interpolate(
        indexValue,
        [0, safeTotalSections],
        [0, -safeTotalSections * PEEK_VIEW_HEIGHT]
      ),
      SPRING_CONFIG
    );

    if (isExpanded) {
      return {
        transform: [{ translateY: 0 }],
      };
    }

    return {
      transform: [{ translateY }],
    };
  });

  const animatedMainStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(isExpanded ? 100 : PEEK_VIEW_HEIGHT, TIMING_CONFIG),
      padding: withTiming(isExpanded ? 11 : 0, TIMING_CONFIG),
      gap: withTiming(isExpanded ? 3 : 0, TIMING_CONFIG),
    };
  });

  const animatedHandleStyle = useAnimatedStyle(() => {
    return {
      borderRadius: withTiming(
        isExpanded ? 12 : PEEK_VIEW_HEIGHT,
        TIMING_CONFIG
      ),
    };
  });

  const animatedAuthorStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(isExpanded ? 0.5 : 0, SPRING_CONFIG),
      transform: [{ translateY: -14 }],
    };
  });

  const scrollFullTitleViewStyle = useAnimatedStyle(() => {
    const indexValue = currentIndex?.value ?? 0;
    const safeTotalSections = Math.max(1, totalSections || 1);

    const translateY = withSpring(
      interpolate(
        indexValue,
        [0, safeTotalSections],
        [0, -safeTotalSections * FULL_VIEW_HEIGHT]
      ),
      SPRING_CONFIG
    );

    return {
      transform: [{ translateY }],
    };
  });

  const SectionList = useMemo(() => {
    const Component = ({
      height,
      small,
    }: {
      height: number;
      small?: boolean;
    }): JSX.Element => {
      return (
        <View>
          {SECTIONS_TITLE.map((title, index) => (
            <View
              key={index}
              style={{
                height,
                justifyContent: 'center',
              }}
            >
              <ThemedText
                invert
                light
                style={{
                  fontSize: scaleFont(14.5),
                  fontFamily: !small ? 'GeistSemiBold' : 'GeistRegular',
                  paddingRight: 8,
                  userSelect: 'none',
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </ThemedText>
            </View>
          ))}
        </View>
      );
    };
    return Component;
  }, [SECTIONS_TITLE, scaleFont]);

  const RadialProgress = useMemo(() => {
    const Component = ({
      progress,
      isExpanded,
    }: {
      progress: SharedValue<number>;
      isExpanded: boolean;
    }) => {
      const radius = 12;
      const strokeWidth = 3;
      const circumference = 2 * Math.PI * radius;
      const size = 32;

      const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: withSpring(
          (1 - (progress?.value ?? 0)) * circumference,
          SPRING_CONFIG
        ),
      }));

      const animatedStyle = useAnimatedStyle(() => {
        return {
          opacity: withSpring(isExpanded ? 0 : 1, SPRING_CONFIG),
          transform: [
            {
              translateX: withSpring(
                isExpanded ? FULL_BAR_HEIGHT : 0,
                SPRING_CONFIG
              ),
            },
            {
              translateY: withSpring(
                isExpanded ? FULL_BAR_HEIGHT : 0,
                SPRING_CONFIG
              ),
            },
          ],
        };
      });

      return (
        <Animated.View
          style={[
            {
              paddingHorizontal: 8,
              alignItems: 'flex-end',
              justifyContent: 'center',
              height: '100%',
            },
            animatedStyle,
          ]}
        >
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#ffffff50"
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Progress Circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={'#ffffff'}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              animatedProps={animatedProps}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
        </Animated.View>
      );
    };
    return Component;
  }, []);

  const Overlay = useMemo(() => {
    const Component = ({
      style,
      stops,
    }: {
      style?: StyleProp<ViewStyle>;
      stops?: [string, string, ...string[]];
    }) => {
      const color = '#000000';
      return (
        <LinearGradient
          colors={stops || [color, 'transparent', 'transparent', color]}
          style={[styles.overlay, style]}
          dither
        />
      );
    };
    return Component;
  }, []);

  const LinearProgress = useMemo(() => {
    const Component = ({ progress }: { progress: SharedValue<number> }) => {
      const totalTime = useSharedValue(TOTAL_TIME * 60);

      const timeCovered = useDerivedValue(() => {
        const progressValue = progress?.value ?? 0;
        return Math.min(
          Math.ceil(totalTime.value * progressValue),
          totalTime.value
        );
      });

      const progressAnimatedStyle = useAnimatedStyle(() => {
        const progressValue = progress?.value ?? 0;
        return {
          width: withSpring(`${progressValue * 100}%`, SPRING_CONFIG),
        };
      });

      return (
        <View
          style={{
            paddingHorizontal: 21,
            flex: 1,
            gap: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View>
            <TimeFlow seconds={timeCovered} hours={false} />
          </View>
          <View
            style={{
              flex: 1,
              height: 7,
              borderRadius: 3.5,
              overflow: 'hidden',
              backgroundColor: '#ffffff40',
            }}
          >
            <Animated.View
              style={[
                {
                  height: '100%',
                  backgroundColor: '#ffffffab',
                  borderRadius: 3,
                },
                progressAnimatedStyle,
              ]}
            />
          </View>
          <View>
            <TimeFlow seconds={totalTime} hours={false} />
          </View>
        </View>
      );
    };
    return Component;
  }, [TOTAL_TIME]);

  if (!blogData || !currentIndex || !progress || !scrollHeight) {
    return null;
  }

  const { author } = blogData;

  return (
    <Animated.View
      style={[styles.container, { backgroundColor }, animatedTextStyle]}
    >
      <Pressable onPress={() => setIsExpanded(prev => !prev)}>
        <Animated.View style={[styles.main, animatedMainStyle]}>
          <View style={styles.handle}>
            <Animated.View style={[styles.handleCircle, animatedHandleStyle]}>
              <Image
                style={styles.image}
                source={blogData.imageUrl}
                contentFit="cover"
              />
            </Animated.View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              maxHeight: '100%',
            }}
          >
            <View style={styles.peek}>
              <Animated.View style={scrollTitleViewStyle}>
                <SectionList height={PEEK_VIEW_HEIGHT} />
              </Animated.View>
              <Overlay />
            </View>
            <Animated.View style={animatedAuthorStyle}>
              <ThemedText
                light
                style={{
                  fontSize: scaleFont(14.8),
                }}
              >
                By {author}
              </ThemedText>
            </Animated.View>
          </View>
          <RadialProgress progress={scrollProgress} isExpanded={isExpanded} />
        </Animated.View>
      </Pressable>
      <Animated.View
        style={{
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            paddingHorizontal: 21,
          }}
        >
          <View
            style={[
              styles.peek,
              {
                marginVertical: FULL_VIEW_COVER_HEIGHT / 2.5,
                maxHeight: FULL_VIEW_HEIGHT,
                overflow: 'visible',
                borderWidth: 1,
                borderBottomColor: '#ffffff35',
                borderTopColor: '#ffffff35',
                maxWidth: 240,
              },
            ]}
          >
            <Animated.View style={[scrollFullTitleViewStyle]}>
              <SectionList height={FULL_VIEW_HEIGHT} small />
            </Animated.View>
          </View>
          <Overlay
            stops={[
              backgroundColor + 'dc',
              backgroundColor + 'bc',
              'transparent',
              backgroundColor + 'bc',
              backgroundColor + 'dc',
            ]}
          />
        </View>
      </Animated.View>
      <LinearProgress progress={scrollProgress} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'red',
    alignSelf: 'center',
    maxWidth: 380,
    bottom: '1.6%',
    overflow: 'hidden',
  },

  peek: {
    maxHeight: PEEK_VIEW_HEIGHT,
    overflow: 'hidden',
    flexDirection: 'column',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },

  main: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handle: {
    padding: 10,
    height: isWeb ? '100%' : 'auto',
  },
  handleCircle: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: '50%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffffff50',
  },
  image: {
    flex: 1,
    width: '100%',
  },
});
