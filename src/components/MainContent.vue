<template>
	<main class="content">
		<div class="container-fluid p-0">
			<h1 class="h3 mb-3"><strong>Analytics</strong> Dashboard</h1>
			<div class="row">
				<!-- Thống kê nhanh -->
				<div class="col-md-3">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Công việc tổng</h5>
							<h1 class="mt-1 mb-3">50</h1> <!-- Fake data -->
							<span class="text-muted">Tất cả các công việc</span>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Hoàn thành</h5>
							<h1 class="mt-1 mb-3">30</h1> <!-- Fake data -->
							<span class="text-success">
								<i class="mdi mdi-check-circle"></i> 60%
							</span>
							<span class="text-muted">Đã hoàn thành</span>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Đang làm</h5>
							<h1 class="mt-1 mb-3">15</h1> <!-- Fake data -->
							<span class="text-warning">
								<i class="mdi mdi-progress-clock"></i> 30%
							</span>
							<span class="text-muted">Công việc đang thực hiện</span>
						</div>
					</div>
				</div>
				<div class="col-md-3">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Quá hạn</h5>
							<h1 class="mt-1 mb-3">5</h1> <!-- Fake data -->
							<span class="text-danger">
								<i class="mdi mdi-alert-circle"></i> 10%
							</span>
							<span class="text-muted">Công việc quá hạn</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Biểu đồ tiến độ công việc -->
			<!-- Biểu đồ tiến độ công việc và công việc theo thời gian trên cùng một hàng -->
			<div class="row">
				<div class="col-xl-4 col-lg-4 col-md-6">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Tiến độ công việc</h5>
							<canvas id="taskProgressChart"></canvas>
						</div>
					</div>
				</div>

				<!-- Biểu đồ công việc theo thời gian to hơn chiếm phần còn lại của dòng -->
				<div class="col-xl-8 col-lg-8 col-md-6">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Công việc theo thời gian</h5>
							<canvas id="taskBarChart"></canvas>
						</div>
					</div>
				</div>
			</div>

			<!-- Bảng danh sách công việc gần đây -->
			<div class="row">
				<div class="col-12">
					<div class="card">
						<div class="card-header">
							<h5 class="card-title">Công việc gần đây</h5>
						</div>
						<div class="card-body">
							<table class="table table-hover">
								<thead>
									<tr>
										<th>#</th>
										<th>Tiêu đề</th>
										<th>Người thực hiện</th>
										<th>Tiến độ</th>
										<th>Ngày hết hạn</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>1</td>
										<td>Công việc 1</td>
										<td>Nguyễn Văn A</td>
										<td>
											<div class="progress">
												<div class="progress-bar" style="width: 80%">80%</div>
											</div>
										</td>
										<td>2024-12-31</td>
									</tr>
									<tr>
										<td>2</td>
										<td>Công việc 2</td>
										<td>Lê Văn B</td>
										<td>
											<div class="progress">
												<div class="progress-bar" style="width: 50%">50%</div>
											</div>
										</td>
										<td>2024-11-30</td>
									</tr>
									<!-- Add more rows as needed -->
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
	name: "MainContent",
	mounted() {
		this.renderTaskProgressChart();
		this.renderTaskBarChart();
	},
	methods: {
		// Biểu đồ hình tròn thể hiện tiến độ công việc
		renderTaskProgressChart() {
			const ctx = document.getElementById("taskProgressChart").getContext("2d");

			new Chart(ctx, {
				type: "pie",
				data: {
					labels: ["Hoàn thành", "Chưa hoàn thành"],
					datasets: [
						{
							label: "Tiến độ công việc",
							data: [75, 25], // Fake data: 75% hoàn thành, 25% chưa hoàn thành
							backgroundColor: ["#28a745", "#dc3545"],
							borderColor: ["#28a745", "#dc3545"],
							borderWidth: 1
						}
					]
				},
				options: {
					responsive: true,
					plugins: {
						legend: {
							display: true,
							position: "bottom"
						}
					}
				}
			});
		},

		// Biểu đồ dạng thanh thể hiện số lượng công việc theo thời gian
		renderTaskBarChart() {
			const ctx = document.getElementById("taskBarChart").getContext("2d");

			new Chart(ctx, {
				type: "bar",
				data: {
					labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"], // Thời gian giả
					datasets: [
						{
							label: "Công việc hoàn thành",
							data: [12, 19, 3, 5], // Fake data cho công việc hoàn thành
							backgroundColor: "#28a745",
							borderColor: "#28a745",
							borderWidth: 1
						},
						{
							label: "Công việc chưa hoàn thành",
							data: [5, 3, 9, 8], // Fake data cho công việc chưa hoàn thành
							backgroundColor: "#dc3545",
							borderColor: "#dc3545",
							borderWidth: 1
						}
					]
				},
				options: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true
						}
					}
				}
			});
		}
	}
};
</script>

<style scoped>
.card {
	word-wrap: break-word;
	background-clip: border-box;
	background-color: #fff;
	border: 0 solid transparent;
	border-radius: .25rem;
	display: flex;
	flex-direction: column;
	min-width: 0;
	position: relative;
}
canvas {
	max-width: 100% !important;
}
</style>
