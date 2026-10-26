import RampHero from '../components/RampHero'
import Statement from '../components/Statement'
import Collections from '../components/Collections'
import FabricLibrary from '../components/FabricLibrary'
import RawToReady from '../components/RawToReady'
import ThreadPath from '../components/ThreadPath'
import Voices from '../components/Voices'

export default function Home() {
  return (
    <main>
      <RampHero />
      <Statement />
      <Collections />
      <FabricLibrary />
      <RawToReady />
      <ThreadPath />
      <Voices />
    </main>
  )
}