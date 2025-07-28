import { BLOGS } from '@/constants';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';

interface BlogCardProps {
  blog: (typeof BLOGS)[0];
  onPress: () => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-neutral-50 border border-neutral-300 rounded-xl overflow-hidden mb-5 mx-1"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      <Image
        source={{ uri: blog.imageUrl }}
        className="w-full h-52 bg-neutral-200"
        resizeMode="cover"
      />
      <View className="p-5">
        <Text
          className="text-2xl font-geist-bold mb-3 text-neutral-900 leading-8"
          numberOfLines={2}
        >
          {blog.title}
        </Text>
        <Text className="text-base font-geist text-neutral-800 mb-2">
          By {blog.author}
        </Text>
        <Text className="text-sm font-geist text-neutral-500 mb-4">
          {new Date(blog.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <Text
          className="text-base leading-6 text-neutral-700 mb-5 font-geist"
          numberOfLines={3}
        >
          {blog.excerpt}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <View key={index} className="bg-neutral-800 px-3 py-2 rounded-full">
              <Text className="text-sm text-neutral-50 font-geist-medium">
                {tag}
              </Text>
            </View>
          ))}
          {blog.tags.length > 3 && (
            <View className="bg-neutral-600 px-3 py-2 rounded-full">
              <Text className="text-sm text-neutral-50 font-geist-medium">
                +{blog.tags.length - 3}
              </Text>
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
      pathname: '/blog/[id]',
      params: { id: blogId.toString() },
    });
  };

  const renderBlogCard = ({ item }: { item: (typeof BLOGS)[0] }) => (
    <BlogCard blog={item} onPress={() => handleBlogPress(item.id)} />
  );

  return (
    <View className="flex-1 bg-neutral-100">
      <FlatList
        data={BLOGS}
        renderItem={renderBlogCard}
        keyExtractor={item => item.id.toString()}
        className="px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
