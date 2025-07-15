/* eslint-disable react-hooks/rules-of-hooks */
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Article from "@/components/ui/Article";
import FlowBar from "@/components/ui/FlowBar";
import Header from "@/components/ui/Header";
import { BLOGS } from "@/constants"; // Single import
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, ViewToken } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

export default function ArticleReadingPage() {
  const { id } = useLocalSearchParams();
  const blogId = parseInt(id as string, 10);

  // Find the blog by ID
  const currentBlog = BLOGS.find((blog) => blog.id === blogId);

  if (!currentBlog) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Blog not found</ThemedText>
      </ThemedView>
    );
  }

  const { content, title, sections } = currentBlog;

  const lastLoggedIndex = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    const lastItem = viewableItems[viewableItems.length - 1];

    if (lastItem?.isViewable && lastItem.index !== null) {
      lastLoggedIndex.value = lastItem.index;
    }
  };

  const viewabilityConfigCallbackPairs = React.useRef([
    {
      viewabilityConfig: { itemVisiblePercentThreshold: 100 },
      onViewableItemsChanged,
    },
  ]);

  const scrollY = useSharedValue(0);
  const totalHeight = useSharedValue(1);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      totalHeight.value =
        event.contentSize.height - event.layoutMeasurement.height;
    },
  });

  const progress = useDerivedValue(() =>
    totalHeight.value > 0 ? scrollY.value / totalHeight.value : 0
  );

  return (
    <ThemedView style={styles.container}>
      <Animated.FlatList
        ListHeaderComponent={() => (
          <Header
            title={title}
            content={content}
            onBackPress={() => {}}
          />
        )}
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
        data={sections}
        renderItem={({ item, index }) => (
          <Article
            title={item.title}
            content={item.content}
            index={index}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />

      <FlowBar
        currentIndex={lastLoggedIndex}
        progress={progress}
        scrollHeight={totalHeight}
        totalSections={sections.length}
        blogData={currentBlog}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  flatList: {
    flex: 1,
    alignSelf: "center",
    maxWidth: 640,
  },
  contentContainer: {
    gap: 16,
    paddingBottom: 280,
  },
});
