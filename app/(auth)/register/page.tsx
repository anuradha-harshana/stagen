import ImageSection from "@/components/ui/ImageSection/ImageSection";
import RegistrationForm from "@/components/ui/Form/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="max-h-screen">

      {/* <Header /> */}

      <section className="h-screen overflow-hidden w-full grid grid-rows-1 lg:grid-cols-2">
        <RegistrationForm />
        <ImageSection />
      </section>

      {/* <Footer /> */}

    </main>
  );
}