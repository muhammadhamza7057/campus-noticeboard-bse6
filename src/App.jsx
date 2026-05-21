import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
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
import { categories, seedNotices } from './lib/constants'
import { useNotices } from './hooks/useNotices'
import { useAuth } from './hooks/useAuth'
import { signOut } from './services/authService'

function App() {
  const { notices, isLoading, addNotice } = useNotices(seedNotices)
  const { user, profile, isSignedIn, isAuthLoading } = useAuth()
  const [activeCategory, setActiveCategory] = useState('All')
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const pendingPostKey = 'campusflow_pending_post'

  const filteredNotices = useMemo(() => {
    if (activeCategory === 'All') {
      return notices
    }

    return notices.filter((notice) => notice.category === activeCategory)
  }, [activeCategory, notices])

  const handleAddNotice = async (notice) => {
    if (!user) {
      setIsFormOpen(false)
      setAuthMode('signup')
      localStorage.setItem(pendingPostKey, '1')
      setIsAuthOpen(true)
      toast('Sign in or create an account first to publish notices.')
      return
    }

    await addNotice({
      ...notice,
      userId: user.id,
    })
    setIsFormOpen(false)
    toast.success('Notice published successfully')
  }

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode)
    setIsAuthOpen(true)
  }

  const handleOpenForm = () => {
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

  const handleSignOut = async () => {
    localStorage.removeItem(pendingPostKey)
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
        />

        <main className="flex-1 space-y-8 pb-8 pt-5 sm:space-y-10 sm:pt-8 lg:pt-12">
          <Hero onPrimaryAction={handleOpenForm} onSecondaryAction={() => handleOpenAuth('login')} />

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
                      <NoticeCard key={notice.id} notice={notice} />
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

      <button
        type="button"
        onClick={handleOpenForm}
        className="fixed bottom-5 right-5 z-30 inline-flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:scale-105 hover:shadow-indigo-950/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950 sm:bottom-7 sm:right-7"
      >
        <Plus className="h-5 w-5" />
        Add Notice
      </button>

      <AuthModal
        isOpen={isAuthOpen}
        defaultMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <NoticeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddNotice}
        profile={profile}
        isSignedIn={isSignedIn}
        onOpenAuth={handleOpenAuth}
      />
    </div>
  )
}

export default App
