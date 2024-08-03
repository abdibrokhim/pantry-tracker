

import CustomCamera from '../components/customCamera';
import Header from '../components/header';

export default function PlaygroundScreen() {
  return (
    <>
      <Header />
      <p className='flex text-[32px] mt-8 items-center justify-center'>Collaborative Pantry</p>
      <main className="flex min-h-screen items-center justify-center p-24">
        {/* sidebar */}
        
        {/* camera component */}
        <CustomCamera />
      </main>
    </>
  );
}