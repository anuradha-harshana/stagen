import ImageSection from "@/components/ui/ImageSection";
import RegistrationForm from "@/components/ui/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="max-h-screen bg-palladian">

      {/* <Header /> */}

      <section className="h-screen overflow-hidden w-full grid grid-rows-1 lg:grid-cols-2">
        <RegistrationForm />
        <ImageSection />
      </section>

      {/* <Footer /> */}

    </main>
  );
}