import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const [error, setError] = useState('');
  
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect authenticated users to home
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate('/');
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-gray-900 to-black relative overflow-hidden">
      {/* floating gradient orbs */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-purple-500/30 blur-3xl top-10 left-10"
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl bottom-10 right-10"
        animate={{ x: [0, -40, 40, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Auth card with 3D tilt */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card border border-purple-500/30 shadow-2xl shadow-purple-800/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Join Jharkhand Tourism'}
              </CardTitle>
              <CardDescription className="mt-2 text-gray-400">
                {isLogin 
                  ? 'Sign in to your account to continue exploring' 
                  : 'Create an account to start your journey'}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 text-white shadow-lg shadow-purple-800/40"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </Button>
              </motion.div>

              <div className="text-center text-sm">
                <span className="text-gray-400">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold text-purple-400 hover:text-purple-300"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setFormData({ email: '', password: '', fullName: '' });
                  }}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
