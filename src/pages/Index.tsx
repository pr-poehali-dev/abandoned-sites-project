import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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
  rating: number;
  ratingsCount: number;
  stories: Story[];
  videos?: string[];
}

interface Story {
  id: number;
  author: string;
  date: string;
  text: string;
  images?: string[];
  video?: string;
}

const initialLocations: Location[] = [
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
    rating: 4.5,
    ratingsCount: 127,
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
    rating: 4.8,
    ratingsCount: 89,
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
    rating: 4.2,
    ratingsCount: 156,
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
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [selectedType, setSelectedType] = useState<LocationType | 'all'>('all');
  const [expandedLocation, setExpandedLocation] = useState<number | null>(null);
  const [storyFormOpen, setStoryFormOpen] = useState(false);
  const [currentLocationId, setCurrentLocationId] = useState<number | null>(null);
  const [newStory, setNewStory] = useState({ author: '', text: '', images: [] as string[], video: '' });
  const [userRatings, setUserRatings] = useState<Record<number, number>>({});

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageUrls: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        imageUrls.push(reader.result as string);
        if (imageUrls.length === files.length) {
          setNewStory(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewStory(prev => ({ ...prev, video: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (index: number) => {
    setNewStory(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddStory = () => {
    if (!newStory.author.trim() || !newStory.text.trim() || !currentLocationId) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      });
      return;
    }

    setLocations(prev => prev.map(loc => {
      if (loc.id === currentLocationId) {
        return {
          ...loc,
          stories: [...loc.stories, {
            id: Date.now(),
            author: newStory.author,
            date: 'только что',
            text: newStory.text,
            images: newStory.images.length > 0 ? newStory.images : undefined,
            video: newStory.video || undefined
          }]
        };
      }
      return loc;
    }));

    setNewStory({ author: '', text: '', images: [], video: '' });
    setStoryFormOpen(false);
    toast({
      title: 'История добавлена!',
      description: 'Спасибо за ваш вклад в каталог локаций',
    });
  };

  const handleRateLocation = (locationId: number, rating: number) => {
    setUserRatings(prev => ({ ...prev, [locationId]: rating }));
    
    setLocations(prev => prev.map(loc => {
      if (loc.id === locationId) {
        const newRatingsCount = loc.ratingsCount + 1;
        const newRating = ((loc.rating * loc.ratingsCount) + rating) / newRatingsCount;
        return {
          ...loc,
          rating: Math.round(newRating * 10) / 10,
          ratingsCount: newRatingsCount
        };
      }
      return loc;
    }));

    toast({
      title: 'Оценка учтена!',
      description: `Вы оценили локацию на ${rating} ${rating === 1 ? 'звезду' : rating < 5 ? 'звезды' : 'звёзд'}`,
    });
  };

  const renderStars = (rating: number, locationId: number, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        const userRating = userRatings[locationId];
        stars.push(
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              if (!userRating) handleRateLocation(locationId, i);
            }}
            disabled={!!userRating}
            className={`transition-colors ${userRating ? 'cursor-not-allowed' : 'cursor-pointer hover:text-primary'}`}
          >
            <Icon
              name={i <= fullStars ? 'Star' : (i === fullStars + 1 && hasHalfStar ? 'StarHalf' : 'Star')}
              size={18}
              className={i <= fullStars ? 'text-primary fill-primary' : (i === fullStars + 1 && hasHalfStar ? 'text-primary fill-primary' : 'text-muted-foreground')}
            />
          </button>
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name={i <= fullStars ? 'Star' : (i === fullStars + 1 && hasHalfStar ? 'StarHalf' : 'Star')}
            size={18}
            className={i <= fullStars ? 'text-primary fill-primary' : (i === fullStars + 1 && hasHalfStar ? 'text-primary fill-primary' : 'text-muted-foreground')}
          />
        );
      }
    }
    return stars;
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

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {renderStars(location.rating, location.id, false)}
                      <span className="text-sm text-muted-foreground ml-1">
                        {location.rating} ({location.ratingsCount})
                      </span>
                    </div>
                    {!userRatings[location.id] && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="text-xs text-primary hover:underline"
                      >
                        Оценить
                      </button>
                    )}
                  </div>

                  {!userRatings[location.id] && expandedLocation === location.id && (
                    <div className="mb-4 p-3 bg-secondary/30 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground mb-2">Ваша оценка:</p>
                      <div className="flex gap-1">
                        {renderStars(location.rating, location.id, true)}
                      </div>
                    </div>
                  )}

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
                              <p className="text-sm text-foreground mb-3">{story.text}</p>
                              
                              {story.images && story.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  {story.images.map((img, idx) => (
                                    <img
                                      key={idx}
                                      src={img}
                                      alt={`Фото ${idx + 1}`}
                                      className="w-full h-32 object-cover rounded-lg border border-border hover:scale-105 transition-transform cursor-pointer"
                                      onClick={() => window.open(img, '_blank')}
                                    />
                                  ))}
                                </div>
                              )}
                              
                              {story.video && (
                                <div className="mt-3">
                                  <video
                                    src={story.video}
                                    controls
                                    className="w-full rounded-lg border border-border"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          
                          <Dialog open={storyFormOpen && currentLocationId === location.id} onOpenChange={(open) => {
                            setStoryFormOpen(open);
                            if (open) setCurrentLocationId(location.id);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full glow-red-hover"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentLocationId(location.id);
                                  setStoryFormOpen(true);
                                }}
                              >
                                <Icon name="Plus" size={16} className="mr-2" />
                                Добавить свою историю
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border" onClick={(e) => e.stopPropagation()}>
                              <DialogHeader>
                                <DialogTitle className="font-oswald text-primary">Поделитесь своей историей</DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Расскажите о своём посещении локации "{location.title}"
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                                <div>
                                  <Label htmlFor="author" className="text-foreground">Ваш никнейм</Label>
                                  <Input
                                    id="author"
                                    placeholder="Сталкер_777"
                                    value={newStory.author}
                                    onChange={(e) => setNewStory(prev => ({ ...prev, author: e.target.value }))}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="text" className="text-foreground">Ваша история</Label>
                                  <Textarea
                                    id="text"
                                    placeholder="Расскажите, что вы видели, какие ощущения испытали, с чем столкнулись..."
                                    value={newStory.text}
                                    onChange={(e) => setNewStory(prev => ({ ...prev, text: e.target.value }))}
                                    className="mt-1 min-h-[120px]"
                                  />
                                </div>
                                
                                <div>
                                  <Label htmlFor="images" className="text-foreground flex items-center gap-2">
                                    <Icon name="Image" size={16} />
                                    Добавить фотографии (до 4 штук)
                                  </Label>
                                  <Input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="mt-1"
                                  />
                                  {newStory.images.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2 mt-3">
                                      {newStory.images.map((img, idx) => (
                                        <div key={idx} className="relative group">
                                          <img
                                            src={img}
                                            alt={`Preview ${idx + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border border-border"
                                          />
                                          <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <Icon name="X" size={14} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <Label htmlFor="video" className="text-foreground flex items-center gap-2">
                                    <Icon name="Video" size={16} />
                                    Добавить видео (один файл)
                                  </Label>
                                  <Input
                                    id="video"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    className="mt-1"
                                  />
                                  {newStory.video && (
                                    <div className="relative mt-3 group">
                                      <video
                                        src={newStory.video}
                                        className="w-full rounded-lg border border-border"
                                        controls
                                      />
                                      <button
                                        onClick={() => setNewStory(prev => ({ ...prev, video: '' }))}
                                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <Icon name="X" size={16} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                                
                                <Button
                                  onClick={handleAddStory}
                                  className="w-full glow-red-hover"
                                >
                                  <Icon name="Send" size={16} className="mr-2" />
                                  Опубликовать историю
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
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