import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
    Alert,
} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

interface MovieSeries {
    id: string;
    title: string;
    genre: string;
    releaseYear: number;
    status: string;
    type: string;
    posterUrl: string;
}

interface MovieActionModalProps {
    visible: boolean;
    movie: MovieSeries | null;
    onClose: () => void;
    onStatusChange: (movieId: string, newStatus: string) => void;
    onDelete: (movieId: string) => void;
}

const MovieActionModal: React.FC<MovieActionModalProps> = ({
                                                               visible,
                                                               movie,
                                                               onClose,
                                                               onStatusChange,
                                                               onDelete,
                                                           }) => {
    const tabs = ['Watchlist', 'Watching', 'Watched'];

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

    const handleDelete = () => {
        if (!movie) return;

        Alert.alert(
            'Delete Movie',
            'Are you sure you want to remove this movie from your collection?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        onDelete(movie.id);
                    },
                },
            ]
        );
    };

    const handleStatusChange = (newStatus: string) => {
        if (!movie) return;
        onStatusChange(movie.id, newStatus);
    };

    return (
        <SafeAreaView>
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >

            <View
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View
                    style={{
                        backgroundColor: '#1f2937',
                        borderRadius: 16,
                        padding: 20,
                        width: width * 0.85,
                        maxWidth: 400,
                        borderWidth: 1,
                        borderColor: 'rgba(75, 85, 99, 0.3)',
                    }}
                >
                    <Text
                        style={{
                            color: '#ffffff',
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginBottom: 20,
                            textAlign: 'center',
                        }}
                    >
                        {movie?.title || 'Movie Options'}
                    </Text>

                    {/* Change Status Section */}
                    <Text
                        style={{
                            color: '#9ca3af',
                            fontSize: 16,
                            marginBottom: 12,
                            fontWeight: '600',
                        }}
                    >
                        Change Status:
                    </Text>

                    {tabs.map((status) => (
                        <TouchableOpacity
                            key={status}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                marginBottom: 8,
                                backgroundColor: movie?.status === status
                                    ? 'rgba(229, 9, 20, 0.2)'
                                    : 'rgba(31, 41, 55, 0.6)',
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: movie?.status === status
                                    ? 'rgba(229, 9, 20, 0.4)'
                                    : 'rgba(75, 85, 99, 0.3)',
                            }}
                            onPress={() => handleStatusChange(status)}
                            disabled={movie?.status === status}
                        >
                            <View
                                style={{
                                    backgroundColor: getStatusColor(status),
                                    width: 24,
                                    height: 24,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12,
                                }}
                            >
                                <Text style={{ fontSize: 12 }}>{getStatusIcon(status)}</Text>
                            </View>
                            <Text
                                style={{
                                    color: movie?.status === status ? '#ffffff' : '#9ca3af',
                                    fontSize: 16,
                                    fontWeight: movie?.status === status ? 'bold' : 'normal',
                                }}
                            >
                                {status}
                            </Text>
                            {movie?.status === status && (
                                <Text
                                    style={{
                                        color: '#10b981',
                                        fontSize: 14,
                                        marginLeft: 'auto',
                                    }}
                                >
                                    Current
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}

                    {/* Delete Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            borderRadius: 12,
                            marginTop: 16,
                            borderWidth: 1,
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={handleDelete}
                    >
                        <Text style={{ color: '#ef4444', fontSize: 18, marginRight: 8 }}>🗑️</Text>
                        <Text
                            style={{
                                color: '#ef4444',
                                fontSize: 16,
                                fontWeight: '600',
                            }}
                        >
                            Delete from Collection
                        </Text>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(75, 85, 99, 0.3)',
                            paddingVertical: 14,
                            paddingHorizontal: 16,
                            borderRadius: 12,
                            marginTop: 12,
                            alignItems: 'center',
                        }}
                        onPress={onClose}
                    >
                        <Text
                            style={{
                                color: '#9ca3af',
                                fontSize: 16,
                                fontWeight: '600',
                            }}
                        >
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        </SafeAreaView>
    );
};

export default MovieActionModal;