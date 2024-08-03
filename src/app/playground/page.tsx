

import CustomCamera from '../components/customCamera';
import Header from '../components/header';

export default function PlaygroundScreen() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center p-24">
        {/* sidebar */}
        
        {/* camera component */}
        <CustomCamera />
      </main>
    </>
  );
}