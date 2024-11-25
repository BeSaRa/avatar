import { Component, computed, inject, input } from '@angular/core'
import { ChartConfiguration, TooltipItem } from 'chart.js'
import { BaseChartDirective } from 'ng2-charts'
import { Context } from 'chartjs-plugin-datalabels'
import { LocalService } from '@/services/local.service'
import { KeyValuePipe } from '@angular/common'
import { ChartRecord } from '@/types/chat-history-chart'
import { Conversation } from '@/models/conversation'
import { SentimentType } from '@/types/sentiment-type'

const COLORS = {
  sentiment: {
    negative: { fill: 'rgba(244, 67, 54, 0.8)', border: 'rgb(244, 67, 54)' }, // Red
    mixed: { fill: 'rgba(255, 193, 7, 0.8)', border: 'rgb(255, 193, 7)' }, // Amber
    positive: { fill: 'rgba(76, 175, 80, 0.8)', border: 'rgb(76, 175, 80)' }, // Green
    neutral: { fill: 'rgba(158, 158, 158, 0.8)', border: 'rgb(158, 158, 158)' }, // Gray
    undefined: { fill: 'rgba(96, 125, 139, 0.8)', border: 'rgb(96, 125, 139)' }, // Blue Gray
  },

  feedback: {
    like: { fill: 'rgba(76, 175, 80, 0.8)', border: 'rgb(76, 175, 80)' }, // Green
    dislike: { fill: 'rgba(244, 67, 54, 0.8)', border: 'rgb(244, 67, 54)' }, // Red
    unspecified: { fill: 'rgba(158, 158, 158, 0.8)', border: 'rgb(158, 158, 158)' }, // Gray
  },
}
@Component({
  selector: 'app-chat-history-charts',
  standalone: true,
  imports: [BaseChartDirective, KeyValuePipe],
  templateUrl: './chat-history-charts.component.html',
  styleUrl: './chat-history-charts.component.scss',
})
export class ChatHistoryChartsComponent {
  conversations = input.required<Conversation[]>()

  lang = inject(LocalService)
  charts = computed(() => {
    if (this.conversations()) {
      return this.getCharts()
    }
    return this.getCharts()
  })

  getCharts(): ChartRecord {
    return {
      feedback_chart: {
        title: this.lang.locals.feedback_chart,
        chart: this.getFeedbackChartConfig(),
      },
      sentiment_chart: {
        title: this.lang.locals.sentiment_chart,
        chart: this.getSentimentChartConfig(),
      },
      performance_chart: {
        title: this.lang.locals.performance_chart,
        chart: this.getBotPerformanceChartConfig(),
      },
    }
  }

  /* ----------------------------- Global Options ----------------------------- */
  getChartOptions(stacked = false): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          rtl: this.lang.currentLanguage === 'ar',
        },
      },
      scales: stacked
        ? {
            x: { stacked: true },
            y: { beginAtZero: true, stacked: true },
          }
        : undefined,
    }
  }

  /* ----------------------------- Sentiment Chart ---------------------------- */
  calculateSetimentDistribution(): ChartConfiguration['data'] {
    const sentimentCounts: Record<SentimentType, number> = {
      negative: 0,
      mixed: 0,
      positive: 0,
      neutral: 0,
      undefined: 0,
    }

    this.conversations().forEach(conversation => {
      if (this.isValidSentiment(conversation.sentiment)) {
        sentimentCounts[conversation.sentiment]++
      } else {
        sentimentCounts.undefined++
      }
    })
    return {
      labels: [
        `😟${this.lang.locals.negative}`,
        `😕${this.lang.locals.mixed}`,
        `😊${this.lang.locals.positive}`,
        `😐${this.lang.locals.neutral}`,
        `❓${this.lang.locals.unspecified}`,
      ],
      datasets: [
        {
          label: this.lang.locals.sentiment,
          data: Object.values(sentimentCounts),
          backgroundColor: [
            COLORS.sentiment.negative.fill,
            COLORS.sentiment.mixed.fill,
            COLORS.sentiment.positive.fill,
            COLORS.sentiment.neutral.fill,
            COLORS.sentiment.undefined.fill,
          ],
          borderColor: [
            COLORS.sentiment.negative.border,
            COLORS.sentiment.mixed.border,
            COLORS.sentiment.positive.border,
            COLORS.sentiment.neutral.border,
            COLORS.sentiment.undefined.border,
          ],
          borderWidth: 2,
        },
      ],
    }
  }

  getSentimentChartConfig(): ChartConfiguration {
    return {
      data: this.calculateSetimentDistribution(),
      type: 'pie',
      options: this.getSentimentChartOptions(),
    }
  }

  getSentimentChartOptions(): ChartConfiguration['options'] {
    return {
      ...this.getChartOptions(),
      plugins: {
        legend: {
          display: true,
          labels: {
            boxWidth: 20,
            padding: 10,
            font: {
              size: 14,
              family: 'Lusail',
            },
          },
          position: 'top',
        },
        tooltip: {
          ...this.getChartOptions()!.plugins!.tooltip,
          callbacks: {
            title: () => {
              return this.lang.locals.sentiment // Use localized sentiment title
            },
            label: (context: TooltipItem<'pie'>) => {
              const label = context.label || '' // Sentiment label
              const dataset = context.dataset.data as number[]
              const total = dataset.reduce((acc: number, value: number) => acc + value, 0)
              const percentage = (((context.raw as number) / total) * 100).toFixed(1)
              return [`${label}:${percentage}%`, `${this.lang.locals.total}:${context.raw}`]
            },
          },
        },
        datalabels: {
          textAlign: 'center',
          color: '#ffffff', // White text for better contrast
          font: {
            size: 14,
          },
          backgroundColor: (context: Context) => (context.dataset.backgroundColor as string[])[context.dataIndex],
          borderColor: '#ffffff',
          borderRadius: 8,
          borderWidth: 1,
          padding: {
            left: 10,
            right: 10,
          },
          display: (context: Context) => {
            const dataset = context.dataset.data as number[]
            const value = dataset[context.dataIndex]
            const total = dataset.reduce((acc: number, val: number) => acc + val, 0)
            return value > total * 0.1
          },
          formatter: (value: number, context: Context) => {
            const dataset = context.dataset.data as number[]
            const total = dataset.reduce((acc: number, val: number) => acc + val, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            const label = (context.chart.data.labels as string[])[context.dataIndex]

            return [label, `${percentage}%`, `${this.lang.locals.total}:${value}`]
          },
        },
      },
    }
  }

  /* ----------------------------- Feedback Chart ---------------------------- */

  calculateFeedbackDistribution(): ChartConfiguration['data'] {
    let likes = 0
    let dislikes = 0
    let unspecified = 0

    this.conversations().forEach(conversation => {
      if (this.isValidFeedback(conversation.feedback)) {
        if (conversation.feedback > 0) {
          likes++
        } else {
          dislikes++
        }
      } else {
        unspecified++
      }
    })
    return {
      labels: [this.lang.locals.feedback], // Shared X-axis label
      datasets: [
        {
          label: this.lang.locals.like,
          data: [likes],
          backgroundColor: COLORS.feedback.like.fill,
          borderColor: COLORS.feedback.like.border,
          borderWidth: 2,
        },
        {
          label: this.lang.locals.dislike,
          data: [dislikes],
          backgroundColor: COLORS.feedback.dislike.fill,
          borderColor: COLORS.feedback.dislike.border,
          borderWidth: 2,
        },
        {
          label: this.lang.locals.unspecified,
          data: [unspecified],
          backgroundColor: COLORS.feedback.unspecified.fill,
          borderColor: COLORS.feedback.unspecified.border,
          borderWidth: 2,
        },
      ],
    }
  }

  getFeedbackChartConfig(): ChartConfiguration {
    return {
      data: this.calculateFeedbackDistribution(),
      type: 'bar',
      options: this.getChartOptions(),
    }
  }

  /* -------------------------- Bot Performence Chart ------------------------- */

  calculateBotPerformance(): ChartConfiguration['data'] {
    const botPerformance: Record<string, { likes: number; dislikes: number; unspecified: number }> = {}

    this.conversations().forEach(conversation => {
      const bot = conversation.bot_name
      if (!botPerformance[bot]) {
        botPerformance[bot] = { likes: 0, dislikes: 0, unspecified: 0 } // Initialize bot performance
      }
      if (this.isValidFeedback(conversation.feedback)) {
        if (conversation.feedback > 0) {
          botPerformance[bot].likes++
        } else {
          botPerformance[bot].dislikes++
        }
      } else {
        botPerformance[bot].unspecified++
      }
    })

    // Convert to dataset format
    return {
      labels: Object.keys(botPerformance), // Bot names
      datasets: [
        {
          label: this.lang.locals.like,
          data: Object.values(botPerformance).map(p => p.likes),
          ...this.generateBotColor(0),
        },
        {
          label: this.lang.locals.dislike,
          data: Object.values(botPerformance).map(p => p.dislikes),
          ...this.generateBotColor(1),
        },
        {
          label: this.lang.locals.unspecified,
          data: Object.values(botPerformance).map(p => p.unspecified),
          ...this.generateBotColor(2),
        },
      ],
    }
  }
  getBotPerformanceChartConfig(): ChartConfiguration {
    return {
      data: this.calculateBotPerformance(),
      type: 'bar',
      options: this.getChartOptions(true), // Stacked bar chart
    }
  }

  generateBotColor(index: number) {
    // Define colors for likes, dislikes, and unspecified explicitly
    const categoryColors = [
      { background: COLORS.feedback.like.fill, border: COLORS.feedback.like.border }, // Likes
      { background: COLORS.feedback.dislike.fill, border: COLORS.feedback.dislike.border }, // Dislikes
      { background: COLORS.feedback.unspecified.fill, border: COLORS.feedback.unspecified.border }, // Unspecified
    ]

    if (index < categoryColors.length) {
      return {
        backgroundColor: categoryColors[index].background,
        borderColor: categoryColors[index].border,
        borderWidth: 2,
      }
    }

    const baseColors = [
      COLORS.feedback.like.fill,
      COLORS.feedback.like.border,
      COLORS.feedback.dislike.fill,
      COLORS.feedback.dislike.border,
    ]

    const baseColor = baseColors[index % baseColors.length]

    const rgbaColor = baseColor.replace('rgb', 'rgba').replace(')', ', 0.6)')

    const borderColor = baseColor.replace('rgb', 'rgba').replace(')', ', 1)')

    return { backgroundColor: rgbaColor, borderColor: borderColor, borderWidth: 2 }
  }

  isValidFeedback(feedback: unknown): feedback is number {
    return feedback !== undefined && feedback !== null && feedback !== ''
  }

  isValidSentiment(sentiment: unknown): sentiment is SentimentType {
    const validSentiments: SentimentType[] = ['negative', 'mixed', 'positive', 'neutral']
    return validSentiments.includes(sentiment as SentimentType)
  }
}
