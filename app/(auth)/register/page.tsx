import ImageSection from "@/components/ui/ImageSection";
import RegistrationForm from "@/components/ui/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* <Header /> */}

      <section className="grid lg:grid-cols-2">

        <RegistrationForm />

        <ImageSection />

      </section>

      {/* <Footer /> */}

    </main>
  );
}