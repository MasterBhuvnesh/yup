// import { BLOGS } from "@/constants";
// import { Text, View } from "react-native";
// export default function App() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-xl font-geist text-black text-center mx-3">
//         {BLOGS[0].title}
//       </Text>
//     </View>
//   );
// }
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BLOGS } from "@/constants"; // Single import
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";

interface BlogCardProps {
  blog: (typeof BLOGS)[0]; // Use first blog as type
  onPress: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
    >
      <Image
        source={{ uri: blog.imageUrl }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <ThemedText
          style={styles.title}
          numberOfLines={2}
        >
          {blog.title}
        </ThemedText>
        <ThemedText style={styles.author}>By {blog.author}</ThemedText>
        <ThemedText style={styles.date}>
          {new Date(blog.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </ThemedText>
        <ThemedText
          style={styles.excerpt}
          numberOfLines={3}
        >
          {blog.excerpt}
        </ThemedText>
        <View style={styles.tagsContainer}>
          {blog.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              style={styles.tag}
            >
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </View>
          ))}
          {blog.tags.length > 3 && (
            <View style={styles.tag}>
              <ThemedText style={styles.tagText}>
                +{blog.tags.length - 3}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default function BlogListingPage() {
  const router = useRouter();

  const handleBlogPress = (blogId: number) => {
    router.push({
      pathname: "/blog/[id]",
      params: { id: blogId.toString() },
    });
  };

  const renderBlogCard = ({ item }: { item: (typeof BLOGS)[0] }) => (
    <BlogCard
      blog={item}
      onPress={() => handleBlogPress(item.id)}
    />
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Blog Articles</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          Discover insights and stories
        </ThemedText>
      </View>

      <FlatList
        data={BLOGS} // Use BLOGS directly
        renderItem={renderBlogCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    marginTop: 2,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerTitle: {
    fontSize: 32,
    // fontWeight: "bold",
    // marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  separator: {
    height: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#e9ecef",
  },
  cardContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    lineHeight: 26,
  },
  author: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c757d",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 12,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    color: "#495057",
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: "#495057",
    fontWeight: "500",
  },
});
