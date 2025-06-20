import { StyleSheet } from 'react-native';
import CalorieFinder from '@/components/CalorieFinder';

export default function HomeScreen() {
  return <CalorieFinder />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
