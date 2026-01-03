import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import type { BookingItem } from "../services/bookingService";

Font.register({
    family: "Roboto",
    fonts: [
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
        },
        {
            src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
            fontWeight: "bold",
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        fontFamily: "Roboto",
        backgroundColor: "#f8fafc",
        flexDirection: "row",
        justifyContent: "center",
    },
    ticketContainer: {
        width: 240,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        boxShadow: "0 4 20 rgba(0,0,0,0.15)",
    },
    header: {
        backgroundColor: "#1e293b",
        padding: 12,
        alignItems: "center",
    },
    cinemaName: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#ffffff",
        letterSpacing: 1.5,
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 7,
        color: "#cbd5e1",
        letterSpacing: 0.5,
    },
    ticketBody: {
        padding: 15,
    },
    movieSection: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottom: "1 solid #e2e8f0",
    },
    movieTitle: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#0f172a",
        marginBottom: 4,
        lineHeight: 1.3,
    },
    movieSubInfo: {
        fontSize: 7,
        color: "#64748b",
    },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        marginBottom: 10,
    },
    statusConfirmed: {
        backgroundColor: "#dcfce7",
    },
    statusPending: {
        backgroundColor: "#fef3c7",
    },
    statusCancelled: {
        backgroundColor: "#fee2e2",
    },
    statusText: {
        fontSize: 7,
        fontWeight: "bold",
        color: "#0f172a",
    },
    infoGrid: {
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 7,
        alignItems: "flex-start",
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 6.5,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 9,
        color: "#0f172a",
        fontWeight: "bold",
        lineHeight: 1.3,
    },
    seatInfo: {
        fontSize: 11,
        color: "#3b82f6",
        fontWeight: "bold",
    },
    priceSection: {
        backgroundColor: "#f8fafc",
        padding: 10,
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceLabel: {
        fontSize: 7,
        color: "#64748b",
        textTransform: "uppercase",
    },
    priceValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0f172a",
    },
    quantityText: {
        fontSize: 7,
        color: "#64748b",
        marginTop: 2,
    },
    paymentInfo: {
        fontSize: 6.5,
        color: "#94a3b8",
        textAlign: "center",
        marginTop: 6,
    },
    stubSection: {
        padding: 15,
        backgroundColor: "#fafafa",
        alignItems: "center",
    },
    qrCode: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    qrLabel: {
        fontSize: 7,
        color: "#64748b",
        textAlign: "center",
        marginBottom: 8,
    },
    bookingId: {
        fontSize: 7,
        color: "#0f172a",
        fontFamily: "Courier",
        letterSpacing: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    footer: {
        marginTop: 8,
        paddingTop: 8,
        borderTop: "1 solid #e2e8f0",
    },
    footerText: {
        fontSize: 6,
        color: "#94a3b8",
        textAlign: "center",
    },
});

interface TicketDocumentProps {
    booking: BookingItem;
    qrCodeDataUrl: string;
}

export const TicketDocument = ({ booking, qrCodeDataUrl }: TicketDocumentProps) => {
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("vi-VN") + " đ";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "confirmed":
                return styles.statusConfirmed;
            case "pending":
                return styles.statusPending;
            case "cancelled":
                return styles.statusCancelled;
            default:
                return styles.statusConfirmed;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "confirmed":
                return "ĐÃ THANH TOÁN";
            case "pending":
                return "CHỜ THANH TOÁN";
            case "cancelled":
                return "ĐÃ HỦY";
            default:
                return status.toUpperCase();
        }
    };

    return (
        <Document>
            {/* Page 1 - Thông tin vé chính */}
            <Page size={{ width: 240, height: 400 }} style={styles.page}>
                <View style={styles.ticketContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.cinemaName}>{booking.cinema}</Text>
                        <Text style={styles.headerSubtitle}>CINEMA TICKET</Text>
                    </View>

                    {/* Ticket Body */}
                    <View style={styles.ticketBody}>
                        {/* Status Badge */}
                        <View style={[styles.statusBadge, getStatusStyle(booking.status)]}>
                            <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
                        </View>

                        {/* Movie Title */}
                        <View style={styles.movieSection}>
                            <Text style={styles.movieTitle}>{booking.movie}</Text>
                            <Text style={styles.movieSubInfo}>{booking.address}</Text>
                        </View>

                        {/* Showtime Info */}
                        <View style={styles.infoGrid}>
                            <View style={styles.infoRow}>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Ngày chiếu</Text>
                                    <Text style={styles.infoValue}>{formatDate(booking.startTime)}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Giờ chiếu</Text>
                                    <Text style={styles.infoValue}>{formatTime(booking.startTime)}</Text>
                                </View>
                            </View>

                            <View style={styles.infoRow}>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Ghế ngồi</Text>
                                    <Text style={styles.seatInfo}>{booking.seat.join(", ")}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Price Section */}
                        <View style={styles.priceSection}>
                            <View>
                                <Text style={styles.priceLabel}>Tổng tiền</Text>
                                <Text style={styles.quantityText}>{booking.quantity} vé</Text>
                            </View>
                            <Text style={styles.priceValue}>{formatCurrency(booking.totalPrice)}</Text>
                        </View>

                        {booking.paidAt && (
                            <View style={styles.paymentInfo}>
                                <Text>Thanh toán: {new Date(booking.paidAt).toLocaleString("vi-VN")}</Text>
                                {booking.paymentProvider && <Text>Phương thức: {booking.paymentProvider.toUpperCase()}</Text>}
                            </View>
                        )}
                    </View>
                </View>
            </Page>

            {/* Page 2 - Phần stub với QR code */}
            <Page size={{ width: 240, height: 400 }} style={styles.page}>
                <View style={styles.ticketContainer}>
                    <View style={styles.stubSection}>
                        <Text style={styles.qrLabel}>QUÉT MÃ TẠI RẠP</Text>
                        <Image src={qrCodeDataUrl} style={styles.qrCode} />
                        <Text style={styles.bookingId}>#{booking.id}</Text>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Vui lòng xuất trình vé này tại quầy để nhận vé giấy</Text>
                            <Text style={styles.footerText}>Cảm ơn bạn đã sử dụng dịch vụ</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
