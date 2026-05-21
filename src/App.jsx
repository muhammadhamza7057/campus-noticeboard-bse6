import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'
import Navbar from './components/Layout/Navbar'
import Hero from './components/Layout/Hero'
import Footer from './components/Layout/Footer'
import AuthModal from './components/Auth/AuthModal'
import NoticeForm from './components/Notice/NoticeForm'
import FilterBar from './components/Notice/FilterBar'
import NoticeCard from './components/Notice/NoticeCard'
import EmptyState from './components/Notice/EmptyState'
import Loader from './components/UI/Loader'
import ConfirmDialog from './components/UI/ConfirmDialog'
import EditProfileModal from './components/Profile/EditProfileModal'
import SettingsModal from './components/Profile/SettingsModal'
import { categories, seedNotices } from './lib/constants'
import { useNotices } from './hooks/useNotices'
import { useAuth } from './hooks/useAuth'
import { signOut } from './services/authService'

function App() {
  const { notices, isLoading, addNotice, updateNotice, deleteNotice } = useNotices(seedNotices)
  const { user, profile, isSignedIn, isAuthLoading, refreshProfile } = useAuth()
  const [activeCategory, setActiveCategory] = useState('All')
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingNotice, setEditingNotice] = useState(null)
  const [noticeToDelete, setNoticeToDelete] = useState(null)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const pendingPostKey = 'campusflow_pending_post'

  const filteredNotices = useMemo(() => {
    if (activeCategory === 'All') {
      return notices
    }

    return notices.filter((notice) => notice.category === activeCategory)
  }, [activeCategory, notices])

  const handleSubmitNotice = async (notice) => {
    if (!user) {
      setIsFormOpen(false)
      setAuthMode('signup')
      localStorage.setItem(pendingPostKey, '1')
      setIsAuthOpen(true)
      toast('Sign in or create an account first to publish notices.')
      return
    }

    const payload = {
      ...notice,
      userId: user.id,
    }

    if (notice.id) {
      await updateNotice(payload)
      toast.success('Notice updated successfully')
    } else {
      await addNotice(payload)
      toast.success('Notice published successfully')
    }

    setIsFormOpen(false)
    setEditingNotice(null)
  }

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  const handleOpenForm = () => {
    setEditingNotice(null)
    if (!user) {
      localStorage.setItem(pendingPostKey, '1')
      handleOpenAuth('signup')
      return
    }

    setIsFormOpen(true)
  }

  const handleAuthSuccess = () => {
    if (authMode === 'signup' || localStorage.getItem(pendingPostKey) === '1') {
      localStorage.removeItem(pendingPostKey)
      setIsFormOpen(true)
    }
  }

  const handleOpenEditNotice = (notice) => {
    setEditingNotice(notice)
    setIsFormOpen(true)
  }

  const handleCloseNoticeForm = () => {
    setIsFormOpen(false)
    setEditingNotice(null)
  }

  const handleConfirmDelete = async () => {
    if (!noticeToDelete) {
      return
    }

    await deleteNotice(noticeToDelete.id)
    toast.success('Notice deleted successfully')
    setNoticeToDelete(null)
  }

  const handleSignOut = async () => {
    localStorage.removeItem(pendingPostKey)
    setIsEditProfileOpen(false)
    setIsSettingsOpen(false)
    await signOut()
    toast.success('Signed out successfully')
  }

  useEffect(() => {
    if (user && localStorage.getItem(pendingPostKey) === '1') {
      localStorage.removeItem(pendingPostKey)
      setIsFormOpen(true)
    }
  }, [user])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.16),_transparent_26%),linear-gradient(180deg,_#020617_0%,_#0f172a_42%,_#111827_100%)] text-slate-50">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.92)',
            color: '#F8FAFC',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            backdropFilter: 'blur(18px)',
          },
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(circle_at_center,black,transparent_88%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 pb-10 pt-3 sm:px-6 lg:px-8 lg:pt-6">
        <Navbar
          onOpenAuth={() => handleOpenAuth('login')}
          onOpenForm={handleOpenForm}
          user={user}
          profile={profile}
          onSignOut={handleSignOut}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="flex-1 space-y-8 pb-8 pt-5 sm:space-y-10 sm:pt-8 lg:pt-12">
          <Hero
            onPrimaryAction={handleOpenForm}
            onSecondaryAction={() => handleOpenAuth('login')}
            isSignedIn={isSignedIn}
          />

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-[0_24px_80px_rgba(2,6,23,0.5)] backdrop-blur-xl sm:p-6 lg:p-7">
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />

            <div className="mt-6 min-h-[20rem]">
              {isLoading || isAuthLoading ? (
                <Loader />
              ) : filteredNotices.length > 0 ? (
                <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {filteredNotices.map((notice) => (
                      <NoticeCard
                        key={notice.id}
                        notice={notice}
                        isOwner={Boolean(user && notice.userId && notice.userId === user.id)}
                        onEdit={() => handleOpenEditNotice(notice)}
                        onDelete={() => setNoticeToDelete(notice)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <EmptyState onReset={() => setActiveCategory('All')} />
              )}
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        defaultMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <NoticeForm
        isOpen={isFormOpen}
        onClose={handleCloseNoticeForm}
        onSubmit={handleSubmitNotice}
        profile={profile}
        isSignedIn={isSignedIn}
        onOpenAuth={handleOpenAuth}
        mode={editingNotice ? 'edit' : 'create'}
        initialValues={editingNotice}
      />
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSaved={() => refreshProfile()}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        isSignedIn={isSignedIn}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onSignOut={handleSignOut}
      />
      <ConfirmDialog
        isOpen={Boolean(noticeToDelete)}
        title="Delete this notice?"
        description={`This will permanently remove ${noticeToDelete?.title ?? 'the selected notice'}.`}
        confirmLabel="Delete notice"
        tone="danger"
        onClose={() => setNoticeToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default App
