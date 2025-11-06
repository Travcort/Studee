import PageHeader from '@/components/PageHeader';
import { useMyAppContext } from '@/lib/Context';
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function SchoolsLayout() {
  const { setOpen } = useMyAppContext();

  return (
    <Stack>
      <Stack.Screen name="index" 
        options={{ 
          header: () => <PageHeader page='Schools' setOpen={setOpen} />
        }} 
      />
      <Stack.Screen name="[schoolCode]/index" 
        options={{ 
          header: () => <PageHeader page='School' setOpen={setOpen} />
        }} 
      />
      <Stack.Screen name="[schoolCode]/departments/[departmentCode]" 
        options={{ 
          header: () => <PageHeader page='Department' setOpen={setOpen} />
        }} 
      />
    </Stack>
  );
}