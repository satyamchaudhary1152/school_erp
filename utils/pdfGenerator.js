const PDFDocument = require("pdfkit");

const COLORS = {

    primary: "#0d6efd",
    success: "#198754",
    danger: "#dc3545",
    warning: "#fd7e14",
    info: "#0dcaf0",
    dark: "#212529",
    light: "#f8f9fa",
    border: "#ced4da"

};

const generateAttendancePDF = (res, reportRows, statistics) => {

    const doc = new PDFDocument({

        margin: 50,
        size: "A4"

    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=Attendance_Report.pdf"
    );

    doc.pipe(res);

    // ============================================
    // Header
    // ============================================

    doc

        .fillColor(COLORS.primary)
        .font("Helvetica-Bold")
        .fontSize(24)
        .text("SCHOOL ERP SYSTEM", {

            align: "center"

        });

    doc

        .moveDown(.2)
        .fillColor(COLORS.dark)
        .fontSize(17)
        .text("ATTENDANCE REPORT", {

            align: "center"

        });

    doc.moveDown(.5);

    doc

        .strokeColor(COLORS.primary)
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();

    doc.moveDown();

    // ============================================
    // Generated Date
    // ============================================

    doc

        .fillColor("black")
        .font("Helvetica")
        .fontSize(11)
        .text(

            `Generated On : ${new Date().toLocaleString()}`,

            {

                align: "right"

            }

        );

    doc.moveDown();

    // ============================================
    // Summary
    // ============================================

    doc

        .fillColor(COLORS.primary)
        .font("Helvetica-Bold")
        .fontSize(15)
        .text("Attendance Summary");

    doc.moveDown(.6);

    doc

        .fillColor("black")
        .font("Helvetica")
        .fontSize(12);

    doc.text(`Total Students : ${statistics.totalStudents}`);

    doc.fillColor(COLORS.success);

    doc.text(`Present        : ${statistics.present}`);

    doc.fillColor(COLORS.danger);

    doc.text(`Absent         : ${statistics.absent}`);

    doc.fillColor(COLORS.warning);

    doc.text(`Late           : ${statistics.late}`);

    doc.fillColor(COLORS.info);

    doc.text(`Leave          : ${statistics.leave}`);

    doc.fillColor(COLORS.dark);

    doc.text(`Attendance %   : ${statistics.attendancePercentage}%`);

    doc.moveDown();

    doc

        .strokeColor(COLORS.border)
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke();

    doc.moveDown();

    // ============================================
    // Table Setup
    // ============================================

    const startX = 50;

    let y = doc.y;

    function drawTableHeader() {

        doc

            .fillColor(COLORS.primary)

            .rect(50, y, 495, 25)

            .fill();

        doc

            .fillColor("white")

            .font("Helvetica-Bold")

            .fontSize(11);

        doc.text("Date", 60, y + 7);

        doc.text("Student", 140, y + 7);

        doc.text("Class", 315, y + 7);

        doc.text("Section", 390, y + 7);

        doc.text("Status", 470, y + 7);

        doc.fillColor("black");

        y += 32;

    }

    drawTableHeader();

    // =====================================================
    // Table Data
    // =====================================================

    doc.font("Helvetica");

    reportRows.forEach((item, index) => {

        // New Page
        if (y > 730) {

            doc.addPage();

            y = 60;

            // Header Again
            doc
                .fillColor("#1F4E78")
                .rect(50, y, 495, 25)
                .fill();

            doc
                .fillColor("white")
                .font("Helvetica-Bold")
                .fontSize(11);

            doc.text("Date", startX + 5, y + 7);
            doc.text("Student", startX + 90, y + 7);
            doc.text("Class", startX + 260, y + 7);
            doc.text("Section", startX + 330, y + 7);
            doc.text("Status", startX + 420, y + 7);

            y += 35;

            doc.font("Helvetica");
        }

        // Alternate Row Color
        if (index % 2 === 0) {

            doc
                .fillColor("#F7F9FC")
                .rect(50, y - 3, 495, 22)
                .fill();

        }

        doc.fillColor("black");

        doc.text(
            new Date(item.date).toLocaleDateString(),
            startX + 5,
            y
        );

        doc.text(
            item.student.name,
            startX + 90,
            y,
            {
                width: 150
            }
        );

        doc.text(
            item.class.className,
            startX + 260,
            y
        );

        doc.text(
            item.section.sectionName,
            startX + 330,
            y
        );

        // Status Color
        switch (item.status) {

            case "Present":
                doc.fillColor("green");
                break;

            case "Absent":
                doc.fillColor("red");
                break;

            case "Late":
                doc.fillColor("orange");
                break;

            case "Leave":
                doc.fillColor("blue");
                break;

            default:
                doc.fillColor("black");

        }

        doc.text(
            item.status,
            startX + 420,
            y
        );

        doc.fillColor("black");

        y += 24;

    });

    // =====================================================
    // Footer
    // =====================================================

    const totalPages = doc.bufferedPageRange().count;

    for (let i = 0; i < totalPages; i++) {

        doc.switchToPage(i);

        doc
            .fontSize(9)
            .fillColor("gray")
            .text(

                `Generated by School ERP System | Page ${i + 1} of ${totalPages}`,

                50,

                800,

                {
                    width: 495,
                    align: "center"
                }

            );

    }

    doc.end();

};

module.exports = generateAttendancePDF;

