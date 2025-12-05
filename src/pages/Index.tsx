import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'extreme';
type LocationType = 'industrial' | 'hospital' | 'amusement' | 'residential' | 'military';

interface Location {
  id: number;
  title: string;
  image: string;
  description: string;
  history: string;
  difficulty: DifficultyLevel;
  danger: number;
  type: LocationType;
  year: string;
  stories: Story[];
}

interface Story {
  id: number;
  author: string;
  date: string;
  text: string;
}

const locations: Location[] = [
  {
    id: 1,
    title: 'Завод "Красный Октябрь"',
    image: 'https://cdn.poehali.dev/projects/6b0b20db-973c-4eb7-af48-63d677d8d38f/files/73fdd3cc-ee69-4431-8559-1873a02d4e7c.jpg',
    description: 'Промышленный гигант советской эпохи, заброшенный в 90-х. Массивные цеха с ржавеющим оборудованием.',
    history: 'Построен в 1952 году как крупнейший металлургический завод региона. Производил военную технику до 1993 года. Закрыт из-за банкротства.',
    difficulty: 'medium',
    danger: 6,
    type: 'industrial',
    year: '1993',
    stories: [
      {
        id: 1,
        author: 'Сталкер_777',
        date: '2 недели назад',
        text: 'Был там прошлым летом. Невероятная атмосфера! Нашёл старые чертежи в административном корпусе. Осторожно с полами на 3 этаже - провалились.'
      },
      {
        id: 2,
        author: 'UrbanExplorer',
        date: '1 месяц назад',
        text: 'Место мощное, но охрана периодически патрулирует. Лучше заходить с восточной стороны через пролом в заборе.'
      }
    ]
  },
  {
    id: 2,
    title: 'Психиатрическая больница №5',
    image: 'https://cdn.poehali.dev/projects/6b0b20db-973c-4eb7-af48-63d677d8d38f/files/1bb94640-1efa-4435-a9ee-c644754a79cd.jpg',
    description: 'Мрачный комплекс больничных корпусов с тёмной историей. Известен жестокими методами лечения.',
    history: 'Открыта в 1968 году. Печально известна экспериментальными методами "лечения". Закрыта в 2001 после скандала с правами пациентов.',
    difficulty: 'hard',
    danger: 8,
    type: 'hospital',
    year: '2001',
    stories: [
      {
        id: 3,
        author: 'DarkWanderer',
        date: '3 дня назад',
        text: 'Самое жуткое место из всех, где я был. В подвале нашли старые медицинские записи - читать страшно. Не советую ходить одному.'
      }
    ]
  },
  {
    id: 3,
    title: 'Парк аттракционов "Чудо-остров"',
    image: 'https://cdn.poehali.dev/projects/6b0b20db-973c-4eb7-af48-63d677d8d38f/files/fca4aca0-830e-417e-90ed-3a4f18c4f5da.jpg',
    description: 'Заброшенный луна-парк с ржавеющими аттракционами и призрачной атмосферой.',
    history: 'Открыт в 1985 году как крупнейший парк развлечений области. Закрыт в 2008 после несчастного случая на колесе обозрения.',
    difficulty: 'easy',
    danger: 4,
    type: 'amusement',
    year: '2008',
    stories: [
      {
        id: 4,
        author: 'PhotoHunter',
        date: '1 неделю назад',
        text: 'Отличное место для фотосессий! Ночью особенно атмосферно. Главное фонарик не забудьте - освещения ноль.'
      }
    ]
  }
];

const difficultyConfig = {
  easy: { label: 'Легко', color: 'bg-green-600' },
  medium: { label: 'Средне', color: 'bg-yellow-600' },
  hard: { label: 'Сложно', color: 'bg-orange-600' },
  extreme: { label: 'Экстрим', color: 'bg-blood-red' }
};

const typeConfig = {
  industrial: { label: 'Промышленность', icon: 'Factory' },
  hospital: { label: 'Больницы', icon: 'Cross' },
  amusement: { label: 'Развлечения', icon: 'Ferris-wheel' },
  residential: { label: 'Жильё', icon: 'Building' },
  military: { label: 'Военные', icon: 'Shield' }
};

export default function Index() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [selectedType, setSelectedType] = useState<LocationType | 'all'>('all');
  const [expandedLocation, setExpandedLocation] = useState<number | null>(null);

  const filteredLocations = locations.filter(loc => {
    if (selectedDifficulty !== 'all' && loc.difficulty !== selectedDifficulty) return false;
    if (selectedType !== 'all' && loc.type !== selectedType) return false;
    return true;
  });

  const getDangerColor = (danger: number) => {
    if (danger <= 3) return 'text-green-500';
    if (danger <= 6) return 'text-yellow-500';
    if (danger <= 8) return 'text-orange-500';
    return 'text-blood-red';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-oswald font-bold text-primary text-shadow-red">
              ABANDONED SITES 18+
            </h1>
            <div className="flex items-center gap-4">
              <Icon name="Skull" className="text-primary" size={32} />
            </div>
          </div>
          <p className="text-muted-foreground mt-2 font-open-sans">
            Исследование заброшенных локаций. Входить на свой страх и риск.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 animate-fade-in">
          <div className="bg-card border border-border rounded-lg p-6 glow-red">
            <h2 className="text-2xl font-oswald font-semibold text-primary mb-4 flex items-center gap-2">
              <Icon name="Filter" size={24} />
              Фильтры поиска
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="Gauge" size={18} />
                  Уровень сложности
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty('all')}
                    className="glow-red-hover"
                  >
                    Все
                  </Button>
                  {Object.entries(difficultyConfig).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={selectedDifficulty === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(key as DifficultyLevel)}
                      className="glow-red-hover"
                    >
                      {config.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="MapPin" size={18} />
                  Тип локации
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType('all')}
                    className="glow-red-hover"
                  >
                    Все
                  </Button>
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <Button
                      key={key}
                      variant={selectedType === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedType(key as LocationType)}
                      className="glow-red-hover"
                    >
                      {config.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-oswald font-bold text-foreground mb-6 flex items-center gap-3">
            <Icon name="Map" size={32} className="text-primary" />
            Локации ({filteredLocations.length})
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location, index) => (
              <Card
                key={location.id}
                className="overflow-hidden bg-card border-border hover:border-primary transition-all duration-300 glow-red-hover cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setExpandedLocation(expandedLocation === location.id ? null : location.id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className={difficultyConfig[location.difficulty].color}>
                      {difficultyConfig[location.difficulty].label}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm">
                      <Icon name="Calendar" size={14} className="mr-1" />
                      {location.year}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="text-xl font-oswald font-semibold text-foreground mb-2">
                    {location.title}
                  </h3>

                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Icon name={typeConfig[location.type].icon} size={16} className="text-primary" />
                      <span className="text-muted-foreground">{typeConfig[location.type].label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="AlertTriangle" size={16} className={getDangerColor(location.danger)} />
                      <span className={getDangerColor(location.danger)}>Опасность: {location.danger}/10</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {location.description}
                  </p>

                  {expandedLocation === location.id ? (
                    <div className="space-y-4 animate-fade-in">
                      <Tabs defaultValue="history" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="history">История</TabsTrigger>
                          <TabsTrigger value="stories">
                            Истории ({location.stories.length})
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="history" className="mt-4">
                          <p className="text-sm text-foreground leading-relaxed">
                            {location.history}
                          </p>
                        </TabsContent>
                        
                        <TabsContent value="stories" className="mt-4 space-y-3">
                          {location.stories.map(story => (
                            <div key={story.id} className="bg-secondary/50 rounded-lg p-3 border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-primary">{story.author}</span>
                                <span className="text-xs text-muted-foreground">{story.date}</span>
                              </div>
                              <p className="text-sm text-foreground">{story.text}</p>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedLocation(null);
                        }}
                      >
                        Свернуть
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full glow-red-hover"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedLocation(location.id);
                      }}
                    >
                      Подробнее
                      <Icon name="ChevronDown" size={16} className="ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <Icon name="SearchX" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-lg">
                Локации не найдены. Попробуйте изменить фильтры.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-border mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Skull" className="text-primary" size={24} />
            <span className="text-lg font-oswald font-semibold text-primary">ABANDONED SITES 18+</span>
          </div>
          <p className="text-muted-foreground text-sm">
            ⚠️ Предупреждение: Посещение заброшенных объектов опасно для жизни. Вся информация предоставлена в ознакомительных целях.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            © 2024 stalk_zktmo | Только для лиц старше 18 лет
          </p>
        </div>
      </footer>
    </div>
  );
}
