export interface RecommendationModule {
  moduleId: string;
  type: 'recommended_for_you' | 'similar' | 'frequently_bought_together' | 'trending' | 'recently_viewed';
  title: string;
  subtitle: string;
  products: any[];
  reason?: string;
  strategy: string;
}
