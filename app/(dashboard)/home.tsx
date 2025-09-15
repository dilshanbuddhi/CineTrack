import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
    Dimensions,
    FlatList,
    RefreshControl,
    Alert,
    Modal,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    interpolate,
    Extrapolate,
    withRepeat,
    withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import MovieActionModal from '@/components/MovieActionModel';
import {deleteMovie, getAllMovies, updateStatus} from "@/services/movieService";
import {Movie} from "@/types/movie";
import {collection, onSnapshot} from "firebase/firestore";
import {auth, db} from "@/firebase";
import Loader from "@/components/Loader";

const { width, height } = Dimensions.get('window');

const sampleMovies: Movie[] = [];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

// Notification Popup Component
const NotificationPopup = ({ visible, movies, onClose, onMoviePress }: {
    visible: boolean;
    movies: Movie[];
    onClose: () => void;
    onMoviePress: (movie: Movie) => void;
}) => {
    const popupAnim = useSharedValue(0);
    const overlayAnim = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            overlayAnim.value = withTiming(1, { duration: 300 });
            popupAnim.value = withDelay(100, withSpring(1, { damping: 15, stiffness: 100 }));
        } else {
            popupAnim.value = withTiming(0, { duration: 200 });
            overlayAnim.value = withDelay(100, withTiming(0, { duration: 200 }));
        }
    }, [visible]);

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayAnim.value,
    }));

    const popupStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: popupAnim.value },
            { translateY: interpolate(popupAnim.value, [0, 1], [50, 0]) },
        ],
        opacity: popupAnim.value,
    }));

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none">
            <Animated.View style={[
                {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                },
                overlayStyle
            ]}>
                <Animated.View style={[popupStyle]}>
                    <BlurView intensity={30} style={{ borderRadius: 20, overflow: 'hidden', margin: 20 }}>
                        <LinearGradient
                            colors={['rgba(31, 41, 55, 0.95)', 'rgba(17, 24, 39, 0.95)']}
                            style={{
                                padding: 24,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(229, 9, 20, 0.3)',
                                maxWidth: width * 0.9,
                                maxHeight: height * 0.7,
                            }}
                        >
                            {/* Header */}
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <Text style={{ fontSize: 40, marginBottom: 8 }}>🔔</Text>
                                <Text style={{
                                    color: '#ffffff',
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    textAlign: 'center'
                                }}>
                                    Weekly Reminder
                                </Text>
                                <Text style={{
                                    color: '#9ca3af',
                                    fontSize: 14,
                                    textAlign: 'center',
                                    marginTop: 4
                                }}>
                                    You have movies waiting to be watched!
                                </Text>
                            </View>

                            {/* Movies List */}
                            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                                {movies.map((movie, index) => (
                                    <TouchableOpacity
                                        key={movie.id}
                                        onPress={() => onMoviePress(movie)}
                                        style={{
                                            flexDirection: 'row',
                                            backgroundColor: 'rgba(75, 85, 99, 0.3)',
                                            borderRadius: 12,
                                            padding: 12,
                                            marginBottom: 12,
                                            borderWidth: 1,
                                            borderColor: 'rgba(229, 9, 20, 0.2)',
                                        }}
                                    >
                                        <View style={{
                                            width: 50,
                                            height: 70,
                                            borderRadius: 8,
                                            overflow: 'hidden',
                                            backgroundColor: '#374151',
                                        }}>
                                            <Image
                                                source={{ uri: movie.posterUrl }}
                                                style={{ width: '100%', height: '100%' }}
                                                resizeMode="cover"
                                            />
                                        </View>

                                        <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
                                            <Text style={{
                                                color: '#ffffff',
                                                fontSize: 16,
                                                fontWeight: 'bold',
                                                marginBottom: 4,
                                            }}>
                                                {movie.title}
                                            </Text>
                                            <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                                                {movie.genre} • {movie.releaseYear}
                                            </Text>
                                            <Text style={{
                                                color: '#f59e0b',
                                                fontSize: 11,
                                                marginTop: 4,
                                                fontStyle: 'italic'
                                            }}>
                                                📋 In watchlist for 7+ days
                                            </Text>
                                        </View>

                                        <View style={{ justifyContent: 'center' }}>
                                            <Text style={{ color: '#e50914', fontSize: 16 }}>▶️</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Action Buttons */}
                            <View style={{
                                flexDirection: 'row',
                                marginTop: 20,
                                gap: 12,
                            }}>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'rgba(75, 85, 99, 0.5)',
                                        padding: 12,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                                        Later
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={onClose}
                                    style={{
                                        flex: 1,
                                        backgroundColor: '#e50914',
                                        padding: 12,
                                        borderRadius: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                                        Got it!
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </BlurView>
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const MovieTrackerHome = () => {
    const [activeTab, setActiveTab] = useState('Watchlist');
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [movies, setMovies] = useState(sampleMovies);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Notification states
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);
    const [weekOldMovies, setWeekOldMovies] = useState<Movie[]>([]);
    const [lastNotificationCheck, setLastNotificationCheck] = useState<string | null>(null);

    const router = useRouter();

    // Check for week-old movies in watchlist
    const checkWeekOldMovies = (moviesList: Movie[]) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const oldMovies = moviesList.filter(movie => {
            if (movie.status !== 'Watchlist') return false;

            // Assuming you have an addedDate field in your Movie type
            // If not, you'll need to add this field to track when movies were added
            const addedDate = movie.createdAt ? new Date(movie.createdAt) : new Date();
            return addedDate <= oneWeekAgo;
        });

        return oldMovies;
    };

    // Show notification popup
    const showWeeklyNotification = () => {
        const today = new Date().toDateString();

        // Check if we already showed notification today
        if (lastNotificationCheck === today) {
            return;
        }

        const oldMovies = checkWeekOldMovies(movies);

        if (oldMovies.length > 0) {
            setWeekOldMovies(oldMovies);
            setShowNotificationPopup(true);
            setLastNotificationCheck(today);
        }
    };

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onSnapshot(
            collection(db, "movies"),
            (querySnapshot) => {
                const allMovies = querySnapshot.docs
                    .filter((doc) => doc.data().userId === auth.currentUser?.uid)
                    .map((doc) => ({...doc.data(), id: doc.id  })) as Movie[];
                setMovies(allMovies);
                setLoading(false);

                // Check for weekly notifications after movies are loaded
                setTimeout(() => showWeeklyNotification(), 2000);
            }
        );
        return () => {
            setLoading(false);
            unsubscribe();
        };
    }, []);

    // Manual notification trigger (for testing)
    const triggerNotification = () => {
        const oldMovies = checkWeekOldMovies(movies);
        if (oldMovies.length > 0) {
            setWeekOldMovies(oldMovies);
            setShowNotificationPopup(true);
        } else {
            Alert.alert("No Old Movies", "No movies have been in your watchlist for more than a week.");
        }
    };

    // Animation values
    const fadeAnim = useSharedValue(0);
    const slideAnim = useSharedValue(50);
    const fabAnim = useSharedValue(0);
    const tabAnim = useSharedValue(0);
    const searchAnim = useSharedValue(0);
    const cardAnimations = useSharedValue(0);

    // Background particles
    const particle1 = useSharedValue(0);
    const particle2 = useSharedValue(0);
    const particle3 = useSharedValue(0);

    const tabs = ['Watchlist', 'Watching', 'Watched'];

    useEffect(() => {
        // Entry animations
        fadeAnim.value = withDelay(200, withTiming(1, { duration: 800 }));
        slideAnim.value = withDelay(300, withSpring(0, { damping: 15, stiffness: 100 }));
        fabAnim.value = withDelay(800, withSpring(1, { damping: 8, stiffness: 100 }));
        tabAnim.value = withDelay(400, withTiming(1, { duration: 600 }));
        searchAnim.value = withDelay(500, withSpring(1, { damping: 12, stiffness: 100 }));
        cardAnimations.value = withDelay(600, withTiming(1, { duration: 800 }));

        // Floating particles animation
        particle1.value = withRepeat(
            withSequence(withTiming(1, { duration: 3000 }), withTiming(0, { duration: 3000 })),
            -1,
            true
        );

        particle2.value = withRepeat(
            withSequence(withTiming(1, { duration: 2500 }), withTiming(0, { duration: 2500 })),
            -1,
            true
        );

        particle3.value = withRepeat(
            withSequence(withTiming(1, { duration: 3500 }), withTiming(0, { duration: 3500 })),
            -1,
            true
        );
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handleDeleteMovie = async (movieId: string) => {
        try {
            setLoading(true);
            await deleteMovie(movieId);
            setShowActionModal(false);
            setSelectedMovie(null);
            console.log("deleted")
        } catch (error) {
            setLoading(false);
            console.log(error);
        }finally {
            setLoading(false)
        }
    };

    const handleChangeStatus = async (movieId: string, newStatus: string) => {
        console.log(movieId, newStatus);
        try {
            setLoading(true);
            await updateStatus(movieId, newStatus);
            setShowActionModal(false);
            setSelectedMovie(null);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }finally {
            setLoading(false)
        }
    };

    const openActionModal = (movie: Movie) => {
        setSelectedMovie(movie);
        setShowActionModal(true);
    };

    const closeActionModal = () => {
        setShowActionModal(false);
        setSelectedMovie(null);
    };

    const handleNotificationMoviePress = (movie: Movie) => {
        setShowNotificationPopup(false);
        openActionModal(movie);
    };

    const filteredMovies = movies.filter((movie) => {
        const matchesTab = movie.status === activeTab;
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Watchlist':
                return '#f59e0b';
            case 'Watching':
                return '#10b981';
            case 'Watched':
                return '#6366f1';
            default:
                return '#9ca3af';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Watchlist':
                return '📋';
            case 'Watching':
                return '👀';
            case 'Watched':
                return '✅';
            default:
                return '📱';
        }
    };

    // Animated styles
    const containerStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
        transform: [{ translateY: slideAnim.value }],
    }));

    const fabStyle = useAnimatedStyle(() => ({
        transform: [{ scale: fabAnim.value }],
    }));

    const tabStyle = useAnimatedStyle(() => ({
        opacity: tabAnim.value,
    }));

    const searchStyle = useAnimatedStyle(() => ({
        transform: [{ scale: searchAnim.value }],
    }));

    const cardStyle = useAnimatedStyle(() => ({
        opacity: cardAnimations.value,
        transform: [
            { translateY: interpolate(cardAnimations.value, [0, 1], [20, 0], Extrapolate.CLAMP) },
        ],
    }));

    const particle1Style = useAnimatedStyle(() => ({
        opacity: interpolate(particle1.value, [0, 1], [0.3, 0.8]),
        transform: [
            { translateY: interpolate(particle1.value, [0, 1], [0, -100]) },
            { translateX: interpolate(particle1.value, [0, 1], [0, 30]) },
        ],
    }));

    const particle2Style = useAnimatedStyle(() => ({
        opacity: interpolate(particle2.value, [0, 1], [0.2, 0.6]),
        transform: [
            { translateY: interpolate(particle2.value, [0, 1], [0, -80]) },
            { translateX: interpolate(particle2.value, [0, 1], [0, -50]) },
        ],
    }));

    const particle3Style = useAnimatedStyle(() => ({
        opacity: interpolate(particle3.value, [0, 1], [0.4, 0.9]),
        transform: [
            { translateY: interpolate(particle3.value, [0, 1], [0, -120]) },
            { translateX: interpolate(particle3.value, [0, 1], [0, 20]) },
        ],
    }));

    const MovieCard = ({ movie, index }: { movie: Movie; index: number }) => {
        // Check if movie is week old
        const isWeekOld = movie.status === 'Watchlist' && movie.createdAt &&
            new Date(movie.createdAt) <= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        return (
            <Animated.View style={[cardStyle, { marginHorizontal: 16, marginBottom: 16 }]}>
                <TouchableOpacity>
                    <BlurView intensity={20} style={{ borderRadius: 16, overflow: 'hidden' }}>
                        <LinearGradient
                            colors={['rgba(31, 41, 55, 0.8)', 'rgba(17, 24, 39, 0.9)']}
                            style={{
                                flexDirection: 'row',
                                padding: 16,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: isWeekOld ? 'rgba(245, 158, 11, 0.5)' : 'rgba(75, 85, 99, 0.3)',
                            }}
                        >
                            {isWeekOld && (
                                <View style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: 'rgba(245, 158, 11, 0.9)',
                                    paddingHorizontal: 8,
                                    paddingVertical: 2,
                                    borderRadius: 10,
                                    zIndex: 1,
                                }}>
                                    <Text style={{ color: '#ffffff', fontSize: 10, fontWeight: '600' }}>
                                        ⏰ 7+ days
                                    </Text>
                                </View>
                            )}

                            <View
                                style={{
                                    width: 80,
                                    height: 120,
                                    borderRadius: 12,
                                    overflow: 'hidden',
                                    backgroundColor: '#374151',
                                }}
                            >
                                <Image
                                    source={{ uri: movie.posterUrl }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode="cover"
                                />
                            </View>

                            <View style={{ flex: 1, marginLeft: 16, justifyContent: 'space-between' }}>
                                <View>
                                    <Text
                                        style={{
                                            color: '#ffffff',
                                            fontSize: 18,
                                            fontWeight: 'bold',
                                            marginBottom: 4,
                                        }}
                                    >
                                        {movie.title}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                                        <Text style={{ color: '#9ca3af', fontSize: 14 }}>
                                            {movie.genre} • {movie.releaseYear} • {movie.type}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View
                                        style={{
                                            backgroundColor: getStatusColor(movie.status),
                                            paddingHorizontal: 12,
                                            paddingVertical: 6,
                                            borderRadius: 20,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontSize: 12, marginRight: 4, color: '#ffffff' }}>
                                            {getStatusIcon(movie.status)}
                                        </Text>
                                        <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '600' }}>
                                            {movie.status}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: 'rgba(229, 9, 20, 0.2)',
                                            padding: 8,
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: 'rgba(229, 9, 20, 0.3)',
                                        }}
                                        onPress={() => openActionModal(movie)}
                                    >
                                        <Text style={{ color: '#ef4444', fontSize: 16 }}>⋯</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </LinearGradient>
                    </BlurView>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#000000" />
            <LinearGradient colors={['#000000', '#111827', '#000000']} style={{ flex: 1 }}>
                <Animated.View style={[{ flex: 1 }, containerStyle]}>
                    {/* Floating Particles */}
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                top: height * 0.1,
                                left: width * 0.8,
                                width: 10,
                                height: 10,
                                backgroundColor: '#e50914',
                                borderRadius: 5,
                            },
                            particle1Style,
                        ]}
                    />
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                top: height * 0.3,
                                left: width * 0.1,
                                width: 6,
                                height: 6,
                                backgroundColor: '#f59e0b',
                                borderRadius: 3,
                            },
                            particle2Style,
                        ]}
                    />
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                top: height * 0.5,
                                left: width * 0.9,
                                width: 8,
                                height: 8,
                                backgroundColor: '#10b981',
                                borderRadius: 4,
                            },
                            particle3Style,
                        ]}
                    />

                    {/* Header */}
                    <View style={{ paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <View>
                                <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: 'bold' }}>
                                    My Collection
                                </Text>
                                <Text style={{ color: '#9ca3af', fontSize: 16, marginTop: 4 }}>
                                    Track your favorite movies & series
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: 'rgba(229, 9, 20, 0.2)',
                                    padding: 12,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: 'rgba(229, 9, 20, 0.3)',
                                }}
                                onPress={triggerNotification}
                            >
                                <Text style={{ fontSize: 20 }}>🔔</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Search Bar */}
                        <AnimatedTextInput
                            style={[
                                searchStyle,
                                {
                                    backgroundColor: 'rgba(31, 41, 55, 0.8)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(75, 85, 99, 0.5)',
                                    padding: 16,
                                    borderRadius: 12,
                                    color: '#ffffff',
                                    fontSize: 16,
                                },
                            ]}
                            placeholder="Search movies & series..."
                            placeholderTextColor="#9ca3af"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Tabs */}
                    <Animated.View style={[tabStyle, { paddingHorizontal: 20, marginBottom: 20 }]}>
                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: 'rgba(31, 41, 55, 0.6)',
                                borderRadius: 12,
                                padding: 4,
                            }}
                        >
                            {tabs.map((tab) => (
                                <TouchableOpacity
                                    key={tab}
                                    onPress={() => setActiveTab(tab)}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 12,
                                        borderRadius: 8,
                                        backgroundColor: activeTab === tab ? '#e50914' : 'transparent',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: activeTab === tab ? '#ffffff' : '#9ca3af',
                                            textAlign: 'center',
                                            fontSize: 16,
                                            fontWeight: activeTab === tab ? 'bold' : 'normal',
                                        }}
                                    >
                                        {getStatusIcon(tab)} {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Movies List */}
                    <FlatList
                        data={filteredMovies}
                        renderItem={({ item, index }) => <MovieCard movie={item} index={index} />}
                        //keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                tintColor="#e50914"
                                colors={['#e50914']}
                            />
                        }
                        ListEmptyComponent={() => (
                            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
                                <Text style={{ fontSize: 60, marginBottom: 16 }}>🎬</Text>
                                <Text style={{ color: '#9ca3af', fontSize: 18, textAlign: 'center' }}>
                                    No {activeTab.toLowerCase()} movies yet
                                </Text>
                                <Text style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 8 }}>
                                    Add some movies to get started!
                                </Text>
                            </View>
                        )}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />

                    {/* Floating Action Button */}
                    <AnimatedTouchableOpacity
                        onPress={() => router.push(`/movies/new`)}
                        style={[
                            fabStyle,
                            {
                                position: 'absolute',
                                bottom: 30,
                                right: 30,
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                shadowColor: '#e50914',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 8,
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['#e50914', '#b8070f']}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold' }}>+</Text>
                        </LinearGradient>
                    </AnimatedTouchableOpacity>
                </Animated.View>

                {/* Weekly Notification Popup */}
                <NotificationPopup
                    visible={showNotificationPopup}
                    movies={weekOldMovies}
                    onClose={() => setShowNotificationPopup(false)}
                    onMoviePress={handleNotificationMoviePress}
                />

                {/* Movie Action Modal */}
                <MovieActionModal
                    visible={showActionModal}
                    movie={selectedMovie}
                    onClose={closeActionModal}
                    onDelete={handleDeleteMovie}
                    onStatusChange={handleChangeStatus}
                />

                {/* Loader */}
                <Loader visible={loading} />
            </LinearGradient>
        </>
    );
};

export default MovieTrackerHome;