import { createContext, useContext, useCallback, useMemo, useState, ReactNode, FC } from 'react'

import SuccessModal from '@shared/ui/Modal/SuccessModal'
import ContactForm from '@features/ContactForm/ContactForm'

import { Modal } from '@shared/ui'

interface ModalState {
    isOpen: boolean
    type: 'consultation' | 'engineer' | 'cost' | null
}

interface SuccessModalState {
    isOpen: boolean
    title: string
    message: string
    autoCloseDelay: number
}

interface ModalContextType {
    // Основные модальные окна (консультация/вызов инженера/расчет)
    modal: ModalState
    openModal: (type: ModalState['type']) => void
    closeModal: () => void

    // Success Modal
    successModal: SuccessModalState
    openSuccessModal: (overrides?: Partial<SuccessModalState>) => void
    closeSuccessModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

interface ModalProviderProps {
    children: ReactNode
}

/**
 * Провайдер для управления всеми модальными окнами в приложении
 * Инкапсулирует состояние и логику открытия/закрытия модалок
 */
export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
    const [modal, setModal] = useState<ModalState>({ isOpen: false, type: null })
    const [successModal, setSuccessModal] = useState<SuccessModalState>({
        isOpen: false,
        title: 'Спасибо!',
        message: 'Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.',
        autoCloseDelay: 3000
    })

    const openModal = useCallback((type: ModalState['type']) => {
        setModal({ isOpen: true, type })
    }, [])

    const closeModal = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false }))
    }, [])

    const openSuccessModal = useCallback((overrides?: Partial<SuccessModalState>) => {
        setSuccessModal(prev => ({
            ...prev,
            isOpen: true,
            ...overrides
        }))
    }, [])

    const closeSuccessModal = useCallback(() => {
        setSuccessModal(prev => ({ ...prev, isOpen: false }))
        // Закрываем основной модал, если он был открыт
        if (modal.isOpen) {
            setModal(prev => ({ ...prev, isOpen: false }))
        }
    }, [modal.isOpen])

    const value = useMemo(() => ({
        modal,
        openModal,
        closeModal,
        successModal,
        openSuccessModal,
        closeSuccessModal
    }), [modal, openModal, closeModal, successModal, openSuccessModal, closeSuccessModal])

    return (
        <ModalContext.Provider value={value}>
            {children}

            {/* Рендеринг основного модального окна */}
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                size="md"
                closeOnOverlayClick={true}
                closeOnEscape={true}
                labelledBy="contact-modal-title"
            >
                <div className="text-left">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 id="contact-modal-title" className="text-xl sm:text-2xl font-black text-[#1a224f] uppercase tracking-wider mb-2">
                            {modal.type === 'consultation' ? 'КОНСУЛЬТАЦИЯ' :
                                modal.type === 'engineer' ? 'ВЫЗОВ ИНЖЕНЕРА' :
                                    modal.type === 'cost' ? 'РАСЧЕТ СТОИМОСТИ' : ''}
                        </h2>
                        <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-[#d71e1e] mb-3 sm:mb-4"></div>
                        <p className="text-xs sm:text-sm text-gray-500">
                            {modal.type === 'cost'
                                ? 'Укажите номер, и мы рассчитаем стоимость за 1 минуту разговора с инженером.'
                                : 'Заполните форму, и мы перезвоним в течение 15 минут.'}
                        </p>
                    </div>

                    {/* ContactForm будет использовать modal.type для определения типа формы */}
                    {modal.type && (
                        <ContactForm
                            type={modal.type === 'cost' ? 'main' : 'modal'}
                            onSubmitSuccess={() => {
                                // Для квиза (cost) открываем специальный SuccessModal с другими текстами
                                if (modal.type === 'cost') {
                                    openSuccessModal({
                                        title: 'Заявка на расчет отправлена!',
                                        message: 'Мы рассчитаем стоимость и свяжемся с вами в течение 1 минуты.'
                                    });
                                } else {
                                    openSuccessModal();
                                }
                            }}
                        />
                    )}
                </div>
            </Modal>

            {/* Рендеринг Success Modal */}
            <SuccessModal
                isOpen={successModal.isOpen}
                onClose={closeSuccessModal}
                title={successModal.title}
                message={successModal.message}
                autoCloseDelay={successModal.autoCloseDelay}
            />
        </ModalContext.Provider>
    )
}

/**
 * Хук для использования ModalContext
 * Выбрасывает ошибку, если используется вне ModalProvider
 */
export const useModal = (): ModalContextType => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal должен использоваться внутри ModalProvider')
    }
    return context
}
