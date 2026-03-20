import { Section } from '@shared/ui/Section'
import { CONTACTS } from '@shared/constants'
import { ContactForm } from '@features/ContactForm'
import { SuccessModalState } from '@shared/providers/modalProvider/ModalProvider.tsx'
import { FC } from 'react'

interface IContacts {
    openSuccessModal: (overrides?: Partial<SuccessModalState>) => void
}

export const ContactsComponent: FC<IContacts> = ({ openSuccessModal }) => {
    return (
        <Section
            id="contacts"
            className="reveal scroll-mt-28 bg-white py-8 sm:scroll-mt-32 sm:py-12 md:py-16 lg:py-24"
        >
            <div className="container mx-auto grid gap-6 px-4 md:grid-cols-2 sm:gap-8 md:gap-12">
                <div>
                    <div className="mb-4 flex items-center space-x-2 sm:mb-6 sm:space-x-3">
                        <div className="h-0.5 w-8 bg-[#d71e1e] sm:h-1 sm:w-12"></div>
                        <h2 className="text-2xl font-black uppercase tracking-wider text-[#1a224f] sm:text-3xl md:text-4xl">СВЯЖИТЕСЬ С НАМИ</h2>
                    </div>
                    <p className="mb-6 text-xs font-medium leading-relaxed text-gray-600 sm:mb-8 sm:text-sm md:text-base lg:text-lg">
                        Оставьте заявку, и наш инженер свяжется с вами в течение 15 минут для консультации. Мы не спамим,
                        звоним только по делу.
                    </p>
                    <div className="space-y-4 sm:space-y-5 md:space-y-6">
                        <a href={`tel:${CONTACTS.phone2.replace(/\D/g, '')}`} className="group flex items-center space-x-3 sm:space-x-4 md:space-x-5">
                            <div className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl bg-gray-50 p-3 text-[#d71e1e] shadow-sm transition-colors group-hover:bg-[#d71e1e] group-hover:text-white sm:p-4">
                                <svg className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-gray-400">Служба сервиса</div>
                                <div className="text-base font-black text-[#1a224f] sm:text-lg md:text-xl">{CONTACTS.phone2}</div>
                            </div>
                        </a>
                        <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5">
                            <div className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl bg-gray-50 p-3 text-[#d71e1e] shadow-sm sm:p-4">
                                <svg className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <div>
                                <div className="text-xs font-black uppercase tracking-widest text-gray-400">Офис и склад</div>
                                <div className="text-base font-black text-[#1a224f] sm:text-lg md:text-xl">г. Орел, ул. 2 Курская, дом 3</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-gray-50 p-6 shadow-lg sm:p-8 md:p-10 lg:p-12">
                    <ContactForm type="main" onSubmitSuccess={openSuccessModal} />
                </div>
            </div>
        </Section>
    )
}