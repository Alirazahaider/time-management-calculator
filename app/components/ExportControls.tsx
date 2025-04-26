import { useRef } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Task, TimeFrame } from '../types';


interface ExportControlsProps {
    targetRef: React.RefObject<HTMLDivElement>;
    tasks: Task[];
    totalAllocatedTime: number;
    availableTime: number;
    remainingTime: number;
    isOverbooked: boolean;
    timeFrame: TimeFrame;
}

export default function ExportControls({
                                           targetRef,
                                           tasks,
                                           totalAllocatedTime,
                                           availableTime,
                                           remainingTime,
                                           isOverbooked,
                                           timeFrame
                                       }: ExportControlsProps) {
    const exportAsImage = async (type: 'png' | 'jpeg') => {
        if (!targetRef.current) return;

        try {
            const dataUrl = type === 'png'
                ? await toPng(targetRef.current)
                : await toJpeg(targetRef.current);

            const link = document.createElement('a');
            link.download = `time-management.${type}`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Error exporting image:', error);
        }
    };

    const exportAsPDF = async () => {
        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const margin = 10;
            let yPos = margin;

            // Add title
            pdf.setFontSize(20);
            pdf.setTextColor(13, 82, 86); // #0d5256
            pdf.text('Time Management Summary', 105, yPos, { align: 'center' });
            yPos += 15;

            // Add date
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
            yPos += 15;

            // Time frame info
            pdf.setFontSize(12);
            pdf.setTextColor(0, 0, 0);
            pdf.text(`Time Frame: ${timeFrame === 'daily' ? 'Daily' : 'Weekly'} (${availableTime} hours)`, margin, yPos);
            yPos += 10;

            // Add tasks table
            pdf.setFontSize(14);
            pdf.setTextColor(13, 82, 86);
            pdf.text('Tasks', margin, yPos);
            yPos += 8;

            // Table headers
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);
            pdf.setFillColor(13, 82, 86);
            pdf.rect(margin, yPos, 170, 8, 'F');
            pdf.text('Task Name', margin + 2, yPos + 6);
            pdf.text('Duration (hrs)', margin + 70, yPos + 6);
            pdf.text('Priority', margin + 110, yPos + 6);
            pdf.text('% of Total', margin + 140, yPos + 6);
            yPos += 8;

            // Task rows
            pdf.setTextColor(0, 0, 0);
            tasks.forEach((task, index) => {
                if (yPos > 270) { // Add new page if needed
                    pdf.addPage();
                    yPos = margin;
                }

                // Alternate row colors
                if (index % 2 === 0) {
                    pdf.setFillColor(237, 242, 244);
                    pdf.rect(margin, yPos, 170, 8, 'F');
                }

                pdf.text(task.name, margin + 2, yPos + 6);
                pdf.text(task.duration.toString(), margin + 70, yPos + 6);
                pdf.text(task.priority || '-', margin + 110, yPos + 6);
                pdf.text(((task.duration / availableTime) * 100).toFixed(1) + '%', margin + 140, yPos + 6);
                yPos += 8;
            });

            // Time summary
            yPos += 10;
            pdf.setFontSize(14);
            pdf.setTextColor(13, 82, 86);
            pdf.text('Time Summary', margin, yPos);
            yPos += 8;

            // Summary table
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);
            pdf.setFillColor(13, 82, 86);
            pdf.rect(margin, yPos, 170, 8, 'F');
            pdf.text('Metric', margin + 2, yPos + 6);
            pdf.text('Value', margin + 70, yPos + 6);
            yPos += 8;

            const summaryData = [
                { label: 'Total Available Time', value: `${availableTime} hours` },
                { label: 'Total Allocated Time', value: `${totalAllocatedTime.toFixed(1)} hours` },
                { label: 'Remaining Time', value: `${Math.abs(remainingTime).toFixed(1)} hours (${isOverbooked ? 'Overbooked' : 'Available'})` },
                { label: 'Utilization', value: `${((totalAllocatedTime / availableTime) * 100).toFixed(1)}%` }
            ];

            pdf.setTextColor(0, 0, 0);
            summaryData.forEach((row, index) => {
                if (yPos > 270) {
                    pdf.addPage();
                    yPos = margin;
                }

                if (index % 2 === 0) {
                    pdf.setFillColor(237, 242, 244);
                    pdf.rect(margin, yPos, 170, 8, 'F');
                }

                pdf.text(row.label, margin + 2, yPos + 6);
                pdf.text(row.value, margin + 70, yPos + 6);
                yPos += 8;
            });

            // Time distribution
            yPos += 10;
            pdf.setFontSize(14);
            pdf.setTextColor(13, 82, 86);
            pdf.text('Time Distribution', margin, yPos);
            yPos += 8;

            // Distribution table
            pdf.setFontSize(10);
            pdf.setTextColor(255, 255, 255);
            pdf.setFillColor(13, 82, 86);
            pdf.rect(margin, yPos, 170, 8, 'F');
            pdf.text('Task', margin + 2, yPos + 6);
            pdf.text('Hours', margin + 70, yPos + 6);
            pdf.text('Percentage', margin + 110, yPos + 6);
            yPos += 8;

            // Sort tasks by duration (descending)
            const sortedTasks = [...tasks].sort((a, b) => b.duration - a.duration);

            pdf.setTextColor(0, 0, 0);
            sortedTasks.forEach((task, index) => {
                if (yPos > 270) {
                    pdf.addPage();
                    yPos = margin;
                }

                if (index % 2 === 0) {
                    pdf.setFillColor(237, 242, 244);
                    pdf.rect(margin, yPos, 170, 8, 'F');
                }

                pdf.text(task.name, margin + 2, yPos + 6);
                pdf.text(task.duration.toString(), margin + 70, yPos + 6);
                pdf.text(((task.duration / availableTime) * 100).toFixed(1) + '%', margin + 110, yPos + 6);
                yPos += 8;
            });

            // Add unallocated time if any
            if (remainingTime > 0) {
                if (yPos > 270) {
                    pdf.addPage();
                    yPos = margin;
                }

                pdf.setFillColor(237, 242, 244);
                pdf.rect(margin, yPos, 170, 8, 'F');
                pdf.text('Unallocated Time', margin + 2, yPos + 6);
                pdf.text(remainingTime.toFixed(1), margin + 70, yPos + 6);
                pdf.text(((remainingTime / availableTime) * 100).toFixed(1) + '%', margin + 110, yPos + 6);
            }

            // Save the PDF
            pdf.save('time-management-summary.pdf');
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    };

    return (
        <div className="flex flex-wrap gap-3 mt-4">
            <button
                onClick={() => exportAsImage('png')}
                className="bg-[#0d5256] text-white py-2 px-4 rounded-md hover:bg-[#0b474a] transition-colors duration-200 text-sm"
            >
                Export as PNG
            </button>
            <button
                onClick={() => exportAsImage('jpeg')}
                className="bg-[#0d5256] text-white py-2 px-4 rounded-md hover:bg-[#0b474a] transition-colors duration-200 text-sm"
            >
                Export as JPEG
            </button>
            <button
                onClick={exportAsPDF}
                className="bg-[#0d5256] text-white py-2 px-4 rounded-md hover:bg-[#0b474a] transition-colors duration-200 text-sm"
            >
                Export as PDF (Table Format)
            </button>
        </div>
    );
}