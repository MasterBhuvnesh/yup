import * as NavigationBar from 'expo-navigation-bar';
import { Slot } from 'expo-router';
import { useEffect } from 'react';

export default function Layout() {
  useEffect(() => {
    // Hide the navigation bar for immersive experience
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return <Slot />;
}
