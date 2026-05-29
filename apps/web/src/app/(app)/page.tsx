import { Dashboard } from "./components/dashboard";
import { listNotesAction } from "./actions/notes";

export default async function Home() {
  const notes = await listNotesAction();

  return <Dashboard initialNotes={notes} />;
}
