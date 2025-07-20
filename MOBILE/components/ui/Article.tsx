import React from 'react';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';

type ArticleProps = {
  title: string;
  content: string[];
  index: number;
};

const Article: React.FC<ArticleProps> = ({ title, content }) => {
  return (
    <View className="my-2 px-4 p-2 rounded-md">
      <View>
        <ThemedText type="default">{title}</ThemedText>
      </View>
      <View className="mt-2 space-y-5">
        {content.map((paragraph, i) => (
          <ThemedText
            key={i}
            className="opacity-80 font-geist-regular"
            type="subtitle"
          >
            {paragraph}
          </ThemedText>
        ))}
      </View>
    </View>
  );
};

export default Article;
