import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { BookingStatistics } from "../services/bookingService";

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
        padding: 30,
        fontFamily: "Roboto",
        fontSize: 10,
    },
    header: {
        textAlign: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: "#64748b",
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#1e293b",
    },
    filterBox: {
        backgroundColor: "#f8fafc",
        padding: 10,
        marginBottom: 15,
    },
    filterText: {
        fontSize: 9,
        marginBottom: 3,
    },
    table: {
        width: "100%",
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 6,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#3b82f6",
        paddingVertical: 8,
        color: "white",
        fontWeight: "bold",
    },
    tableCell: {
        flex: 1,
        fontSize: 9,
        paddingHorizontal: 4,
    },
    tableCellCenter: {
        flex: 1,
        fontSize: 9,
        paddingHorizontal: 4,
        textAlign: "center",
    },
    tableCellRight: {
        flex: 1,
        fontSize: 9,
        paddingHorizontal: 4,
        textAlign: "right",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#f8fafc",
        padding: 12,
        borderRadius: 4,
        marginBottom: 15,
    },
    summaryItem: {
        alignItems: "center",
    },
    summaryLabel: {
        fontSize: 8,
        color: "#64748b",
        marginBottom: 3,
    },
    summaryValue: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#1e293b",
    },
});

interface ReportDocumentProps {
    statistics: BookingStatistics;
    filters: {
        fromDate: string;
        toDate: string;
        movieName?: string;
        cinemaName?: string;
    };
}

export const ReportDocument = ({ statistics, filters }: ReportDocumentProps) => {
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString("vi-VN") + " đ";
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>BÁO CÁO GIAO DỊCH VÀ DOANH THU</Text>
                    <Text style={styles.subtitle}>
                        Ngày xuất: {new Date().toLocaleDateString("vi-VN")} {new Date().toLocaleTimeString("vi-VN")}
                    </Text>
                </View>

                {/* Thông tin lọc */}
                <View style={styles.filterBox}>
                    <Text style={[styles.filterText, { fontWeight: "bold", marginBottom: 5 }]}>THÔNG TIN LỌC</Text>
                    <Text style={styles.filterText}>
                        • Thời gian: {filters.fromDate} - {filters.toDate}
                    </Text>
                    <Text style={styles.filterText}>• Phim: {filters.movieName || "Tất cả"}</Text>
                    <Text style={styles.filterText}>• Rạp: {filters.cinemaName || "Tất cả"}</Text>
                </View>

                {/* Tổng quan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>TỔNG QUAN</Text>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Tổng doanh thu</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(statistics.totalRevenue)}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Tổng giao dịch</Text>
                            <Text style={styles.summaryValue}>{statistics.totalBookings}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Vé đã bán</Text>
                            <Text style={styles.summaryValue}>{statistics.totalTickets}</Text>
                        </View>
                    </View>
                </View>

                {/* Thống kê theo phim */}
                {statistics.byMovie && statistics.byMovie.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>THỐNG KÊ THEO PHIM</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableHeader, { backgroundColor: "#6366f1" }]}>
                                <Text style={[styles.tableCell, { flex: 2 }]}>Tên phim</Text>
                                <Text style={styles.tableCellRight}>Doanh thu</Text>
                                <Text style={styles.tableCellCenter}>Vé</Text>
                                <Text style={styles.tableCellCenter}>Giao dịch</Text>
                            </View>
                            {statistics.byMovie.map((movie, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { flex: 2 }]}>{movie.movieTitle}</Text>
                                    <Text style={styles.tableCellRight}>{formatCurrency(movie.revenue)}</Text>
                                    <Text style={styles.tableCellCenter}>{movie.tickets}</Text>
                                    <Text style={styles.tableCellCenter}>{movie.bookings}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Thống kê theo rạp */}
                {statistics.byCinema && statistics.byCinema.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>THỐNG KÊ THEO RẠP</Text>
                        <View style={styles.table}>
                            <View style={[styles.tableHeader, { backgroundColor: "#8b5cf6" }]}>
                                <Text style={[styles.tableCell, { flex: 2 }]}>Tên rạp</Text>
                                <Text style={styles.tableCellRight}>Doanh thu</Text>
                                <Text style={styles.tableCellCenter}>Vé</Text>
                                <Text style={styles.tableCellCenter}>Giao dịch</Text>
                            </View>
                            {statistics.byCinema.map((cinema, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCell, { flex: 2 }]}>{cinema.cinemaName}</Text>
                                    <Text style={styles.tableCellRight}>{formatCurrency(cinema.revenue)}</Text>
                                    <Text style={styles.tableCellCenter}>{cinema.tickets}</Text>
                                    <Text style={styles.tableCellCenter}>{cinema.bookings}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};
