import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Dimensions,
    Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Movie } from "../types/movie";
import Loader from "@/components/Loader";

const { width } = Dimensions.get("window");

// Custom Dark Alert Component
interface CustomDeleteAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

const CustomDeleteAlert: React.FC<CustomDeleteAlertProps> = ({
                                                                 visible,
                                                                 title,
                                                                 message,
                                                                 onCancel,
                                                                 onConfirm,
                                                             }) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.85)",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 20,
                }}
            >
                <View
                    style={{
                        backgroundColor: "#1f2937",
                        borderRadius: 20,
                        padding: 24,
                        width: width * 0.85,
                        maxWidth: 350,
                        borderWidth: 1,
                        borderColor: "rgba(239, 68, 68, 0.3)",
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 20,
                        elevation: 10,
                    }}
                >
                    {/* Alert Icon */}
                    <View
                        style={{
                            alignItems: "center",
                            marginBottom: 16,
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "rgba(239, 68, 68, 0.2)",
                                width: 60,
                                height: 60,
                                borderRadius: 30,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 2,
                                borderColor: "rgba(239, 68, 68, 0.4)",
                            }}
                        >
                            <Text style={{ fontSize: 28 }}>⚠️</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <Text
                        style={{
                            color: "#ffffff",
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "center",
                            marginBottom: 8,
                        }}
                    >
                        {title}
                    </Text>

                    {/* Message */}
                    <Text
                        style={{
                            color: "#9ca3af",
                            fontSize: 16,
                            textAlign: "center",
                            lineHeight: 22,
                            marginBottom: 24,
                        }}
                    >
                        {message}
                    </Text>

                    {/* Buttons */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: 12,
                        }}
                    >
                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(75, 85, 99, 0.4)",
                                paddingVertical: 14,
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: "rgba(75, 85, 99, 0.6)",
                            }}
                            onPress={onCancel}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={{
                                    color: "#9ca3af",
                                    fontSize: 16,
                                    fontWeight: "600",
                                    textAlign: "center",
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        {/* Delete Button */}
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                backgroundColor: "#ef4444",
                                paddingVertical: 14,
                                borderRadius: 12,
                                shadowColor: "#ef4444",
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                                elevation: 6,
                            }}
                            onPress={onConfirm}
                            activeOpacity={0.8}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text style={{ color: "#ffffff", fontSize: 16, marginRight: 6 }}>
                                    🗑️
                                </Text>
                                <Text
                                    style={{
                                        color: "#ffffff",
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Delete
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

interface MovieActionModalProps {
    visible: boolean;
    movie: Movie | null;
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
    const tabs = ["Watchlist", "Watching", "Watched"];
    const [loading, setLoading] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Watchlist":
                return "#f59e0b";
            case "Watching":
                return "#10b981";
            case "Watched":
                return "#6366f1";
            default:
                return "#9ca3af";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Watchlist":
                return "📋";
            case "Watching":
                return "👀";
            case "Watched":
                return "✅";
            default:
                return "📱";
        }
    };

    const handleDelete = () => {
        if (!movie) return;
        try {
            setLoading(true);
            setShowDeleteAlert(true);
        } catch (error) {
            console.error("Error opening delete alert:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = () => {
        setShowDeleteAlert(false);
        if (movie?.id) {
            onDelete(movie.id);
            onClose();
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            setLoading(true);
            if (movie?.id) {
                await onStatusChange(movie.id, newStatus);
            }
        } catch (error) {
            console.error("Error changing status:", error);
        } finally {
            setLoading(false);
        }
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
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "#1f2937",
                            borderRadius: 16,
                            padding: 20,
                            width: width * 0.85,
                            maxWidth: 400,
                            borderWidth: 1,
                            borderColor: "rgba(75, 85, 99, 0.3)",
                        }}
                    >
                        <Text
                            style={{
                                color: "#ffffff",
                                fontSize: 18,
                                fontWeight: "bold",
                                marginBottom: 20,
                                textAlign: "center",
                            }}
                        >
                            {movie?.title || "Movie Options"}
                        </Text>

                        {/* Change Status Section */}
                        <Text
                            style={{
                                color: "#9ca3af",
                                fontSize: 16,
                                marginBottom: 12,
                                fontWeight: "600",
                            }}
                        >
                            Change Status:
                        </Text>

                        {tabs.map((status) => (
                            <TouchableOpacity
                                key={status}
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                    marginBottom: 8,
                                    backgroundColor:
                                        movie?.status === status
                                            ? "rgba(229, 9, 20, 0.2)"
                                            : "rgba(31, 41, 55, 0.6)",
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor:
                                        movie?.status === status
                                            ? "rgba(229, 9, 20, 0.4)"
                                            : "rgba(75, 85, 99, 0.3)",
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
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: 12,
                                    }}
                                >
                                    <Text style={{ fontSize: 12 }}>{getStatusIcon(status)}</Text>
                                </View>
                                <Text
                                    style={{
                                        color: movie?.status === status ? "#ffffff" : "#9ca3af",
                                        fontSize: 16,
                                        fontWeight: movie?.status === status ? "bold" : "normal",
                                    }}
                                >
                                    {status}
                                </Text>
                                {movie?.status === status && (
                                    <Text
                                        style={{
                                            color: "#10b981",
                                            fontSize: 14,
                                            marginLeft: "auto",
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
                                backgroundColor: "rgba(239, 68, 68, 0.2)",
                                paddingVertical: 14,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                                marginTop: 16,
                                borderWidth: 1,
                                borderColor: "rgba(239, 68, 68, 0.3)",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={handleDelete}
                        >
                            <Text style={{ color: "#ef4444", fontSize: 18, marginRight: 8 }}>
                                🗑️
                            </Text>
                            <Text
                                style={{
                                    color: "#ef4444",
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                Delete from Collection
                            </Text>
                        </TouchableOpacity>

                        {/* Cancel Button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: "rgba(75, 85, 99, 0.3)",
                                paddingVertical: 14,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                                marginTop: 12,
                                alignItems: "center",
                            }}
                            onPress={onClose}
                        >
                            <Text
                                style={{
                                    color: "#9ca3af",
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Loader visible={loading} />

                    {/* Custom Delete Alert */}
                    <CustomDeleteAlert
                        visible={showDeleteAlert}
                        title="Delete Movie"
                        message={`Are you sure you want to remove "${movie?.title}" from your collection? This action cannot be undone.`}
                        onCancel={() => setShowDeleteAlert(false)}
                        onConfirm={handleConfirmDelete}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default MovieActionModal;