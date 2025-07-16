import { useScaleFont } from '@/hooks/useFontScale';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import ResponsiveText from '../ResponsiveText';
import { ThemedText } from '../ThemedText';

interface HeaderProps {
  title: string;
  content: string;
  onBackPress: () => void;
}

const Header = ({ title, content, onBackPress }: HeaderProps) => {
  const scaleFont = useScaleFont();
  return (
    <View className="flex flex-col items-center px-4 py-3 gap-1">
      <View className="flex-row w-full py-4 items-center justify-between">
        <TouchableOpacity onPress={onBackPress}>
          <Ionicons
            name="chevron-back-outline"
            color="#000"
            size={scaleFont(25)}
          />
        </TouchableOpacity>
      </View>
      <View className="flex flex-col w-full gap-1.5">
        <View>
          <ResponsiveText text={title} baseSize={29} type="title" />
        </View>
        <ThemedText className="py-1.5" type="subtitle">
          {content}
        </ThemedText>
      </View>
    </View>
  );
};

export default Header;
