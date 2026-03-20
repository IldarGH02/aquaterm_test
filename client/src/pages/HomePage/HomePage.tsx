import { useEffect } from 'react';
import { useModal } from '@shared/lib/hooks/useModal.tsx';
import { Header } from '@widgets/Header';
import { Hero } from '@widgets/Hero/Hero.tsx';
import { BrandsComponent } from '@widgets/Brands/Brands.tsx';
import { Services } from '@widgets/Services/Services.tsx';
import { Advantages } from '@widgets/Advantages/Advantages.tsx';
import { Process } from '@widgets/Process/Process.tsx';
import { Cases } from '@widgets/Cases/Cases.tsx';
import { Quiz } from '@widgets/Quiz';
import { FAQ } from '@widgets/FAQ/FAQ.tsx';
import { Reviews } from '@widgets/Reviews/Reviews.tsx';
import { Footer } from '@widgets/Footer';
import { ContactsComponent } from '@widgets/Contacts/Contants.tsx'

export const HomePage = () => {
  const { openModal, openSuccessModal } = useModal();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.classList.contains('reveal')) {
              observer.observe(element);
            }
            element.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
          }
        });
      });
    });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onCtaClick={() => openModal('engineer')} />

      <main>
          <Hero onCtaPrimary={() => openModal('cost')} onCtaSecondary={() => openModal('engineer')} />
          <BrandsComponent />
          <Services onCtaClick={() => openModal('consultation')} />
          <Advantages />
          <Process />
          <Quiz
              onSubmitSuccess={() => openSuccessModal({
                  title: 'Заявка на расчет отправлена!',
                  message: 'Мы рассчитаем стоимость и свяжемся с вами в течение 1 минуты.',
              })
          }/>
          <Cases />
          <FAQ />
          <Reviews />
          <ContactsComponent openSuccessModal={openSuccessModal}/>
      </main>

      <Footer />
    </div>
  );
};
